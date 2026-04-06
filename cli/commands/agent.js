import { plannerAgent } from '../../agents/planner/plannerAgent.js';
import { codingAgent } from '../../agents/coding/codingAgent.js';
import { criticAgent } from '../../agents/critic/criticAgent.js';
import { refinerAgent } from '../../agents/refiner/refinerAgent.js';
import { streamOutput } from '../ui/output.js';
import { renderDivider, renderError } from '../ui/prompt.js';
import { extractCodeBlocks } from '../../tools/code/extractor.js';
import { runCode } from '../../tools/code/codeRunner.js';
import chalk from 'chalk';

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
  const codeOutput = await streamOutput(codeGen);

  console.log(chalk.cyan('\n[3/5] Executing generated code...'));
  const blocks = extractCodeBlocks(codeOutput);
  let executionLog = 'No runnable code blocks found.';
  
  if (blocks.length > 0) {
    const runnable = blocks.find(b => ['javascript', 'js', 'node', 'python', 'py', 'bash', 'sh'].includes(b.language));
    if (runnable) {
      console.log(chalk.gray(`Running ${runnable.language} code block...`));
      const result = await runCode(runnable.language, runnable.code);
      executionLog = `Execution Exit Code: ${result.exitCode}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`;
      console.log(chalk.dim(executionLog));
    } else {
      console.log(chalk.yellow('No supported languages found in code blocks.'));
    }
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
