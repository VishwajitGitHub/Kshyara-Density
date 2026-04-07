import { plannerAgent } from '../../agents/planner/plannerAgent.js';
import { codingAgent } from '../../agents/coding/codingAgent.js';
import { criticAgent } from '../../agents/critic/criticAgent.js';
import { refinerAgent } from '../../agents/refiner/refinerAgent.js';
import { debugAgent } from '../../agents/debug/debugAgent.js';
import { streamOutput } from '../ui/output.js';
import { renderDivider, renderError, renderSuccess } from '../ui/prompt.js';
import { extractCodeBlocks } from '../../tools/code/extractor.js';
import { runCode } from '../../tools/code/codeRunner.js';
import chalk from 'chalk';

const MAX_RETRIES = 3;

export async function agentCommand(args) {
  const prompt = args.join(' ');
  if (!prompt) {
    console.log(renderError('Usage: /agent <task>'));
    return;
  }

  console.log();
  console.log(renderDivider('Autonomous Agent Swarm'));
  
  console.log(chalk.cyan('\n[1/5] Planner Agent is breaking down the task...'));
  const planRes = await plannerAgent.execute(prompt);
  console.log(chalk.gray(planRes.content));

  console.log(chalk.cyan('\n[2/5] Coding Agent is writing the code...'));
  const codeGen = codingAgent.streamExecute(`Original Task: ${prompt}\n\nPlan:\n${planRes.content}\n\nExecute this plan. Write complete, runnable code.`);
  let codeOutput = await streamOutput(codeGen);

  let executionLog = '';
  let success = false;
  let attempts = 0;

  console.log(chalk.cyan('\n[3/5] Executing and Auto-Fixing...'));

  while (attempts < MAX_RETRIES && !success) {
    attempts++;
    const blocks = extractCodeBlocks(codeOutput);
    
    if (blocks.length === 0) {
      executionLog = 'No runnable code blocks found.';
      break;
    }

    const runnable = blocks.find(b => ['javascript', 'js', 'node', 'python', 'py', 'bash', 'sh'].includes(b.language));
    if (!runnable) {
      executionLog = 'No supported languages found in code blocks.';
      break;
    }

    console.log(chalk.gray(`  Attempt ${attempts}: Running ${runnable.language} code...`));
    const result = await runCode(runnable.language, runnable.code);
    executionLog = `Exit Code: ${result.exitCode}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`;
    
    if (result.exitCode === 0) {
      console.log(renderSuccess(`  Execution succeeded in ${result.duration}ms!`));
      if (result.stdout) console.log(chalk.dim(result.stdout.trim()));
      success = true;
    } else {
      console.log(renderError(`  Execution failed (Code ${result.exitCode}).`));
      console.log(chalk.dim(result.stderr.trim()));
      
      if (attempts < MAX_RETRIES) {
        console.log(chalk.yellow(`  Invoking Debug Agent to fix the error...`));
        const debugGen = debugAgent.streamExecute(`Original Task: ${prompt}\n\nFailing Code:\n\`\`\`${runnable.language}\n${runnable.code}\n\`\`\`\n\nExecution Log:\n${executionLog}\n\nFix the code and return the working version.`);
        codeOutput = await streamOutput(debugGen);
      }
    }
  }

  if (!success) {
    console.log(chalk.red('\nSwarm failed to produce working code after maximum retries. Proceeding to Critic anyway.'));
  }

  console.log(chalk.cyan('\n[4/5] Critic Agent is reviewing the code and execution results...'));
  const criticGen = criticAgent.streamExecute(`Review this code for task: ${prompt}\n\nCode:\n${codeOutput}\n\nExecution Results:\n${executionLog}`);
  const criticOutput = await streamOutput(criticGen);
  
  console.log(chalk.cyan('\n[5/5] Refiner Agent is polishing the final output...'));
  const refinerGen = refinerAgent.streamExecute(`Original Task: ${prompt}\n\nCode:\n${codeOutput}\n\nCritic Feedback:\n${criticOutput}\n\nExecution Results:\n${executionLog}\n\nProvide the final, fixed, and polished code based on the critique.`);
  await streamOutput(refinerGen);

  console.log(renderDivider('Swarm Execution Complete'));
  console.log();
}
