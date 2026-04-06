import { exec } from 'child_process';
import { promisify } from 'util';
import { renderError, renderDivider } from '../ui/prompt.js';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function shellCommand(args) {
  const command = args.join(' ');
  if (!command) {
    console.log(renderError('Usage: /shell <command>'));
    return;
  }

  console.log();
  console.log(renderDivider(`Executing shell command`));
  
  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
    if (stdout) console.log(chalk.gray(stdout));
    if (stderr) console.log(chalk.red(stderr));
  } catch (err) {
    if (err.stdout) console.log(chalk.gray(err.stdout));
    if (err.stderr) console.log(chalk.red(err.stderr));
    console.log(renderError(`Command failed with exit code ${err.code || 1}`));
  }
  console.log();
}
