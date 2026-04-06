import { runCode } from '../../tools/code/codeRunner.js';
import { renderError, renderDivider } from '../ui/prompt.js';
import chalk from 'chalk';

export async function runCommand(args) {
  const language = args[0];
  const code = args.slice(1).join(' ');
  
  if (!language || !code) {
    console.log(renderError('Usage: /run <language> <code>'));
    return;
  }

  console.log();
  console.log(renderDivider(`Executing ${language} code`));
  
  try {
    const startTime = Date.now();
    const result = await runCode(language, code);
    const latency = Date.now() - startTime;
    
    if (result.stdout) {
      console.log(chalk.gray(result.stdout));
    }
    if (result.stderr) {
      console.log(chalk.red(result.stderr));
    }
    
    const statusColor = result.exitCode === 0 ? chalk.green : chalk.red;
    console.log(renderDivider(`Execution finished in ${latency}ms with exit code ${statusColor(result.exitCode)}`));
  } catch (err) {
    console.log(renderError(`Execution failed: ${err.message}`));
  }
  console.log();
}
