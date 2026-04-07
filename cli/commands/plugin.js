import { renderError, renderSuccess, renderDivider } from '../ui/prompt.js';
import chalk from 'chalk';

export async function pluginCommand(args) {
  console.log();
  console.log(renderDivider('Plugin Manager'));
  console.log(chalk.yellow('  Plugin system is currently under development.'));
  console.log(chalk.gray('  Future versions will allow loading custom .js commands from ~/.kshyara/plugins/'));
  console.log();
}
