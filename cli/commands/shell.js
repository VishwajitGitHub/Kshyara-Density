import { execSync } from 'child_process';
import { renderError, renderSuccess, renderDivider } from '../ui/prompt.js';
import { state } from '../state/index.js';
import chalk from 'chalk';

export async function shellCommand(args) {
  if (args.length === 0) {
    console.log(renderError('Usage: /shell <command>'));
    return;
  }

  const cmd = args.join(' ');
  console.log(chalk.gray(`> ${cmd}\n`));

  try {
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    if (output) console.log(output.trim());
    else console.log(chalk.gray('(No output)'));
    
    state.addToConversation('system', `User ran shell command: ${cmd}\nOutput:\n${output}`);
  } catch (error) {
    const errOut = error.stderr ? error.stderr.toString().trim() : error.message;
    console.log(renderError(errOut));
    state.addToConversation('system', `User ran shell command: ${cmd}\nError:\n${errOut}`);
  }
  console.log();
}
