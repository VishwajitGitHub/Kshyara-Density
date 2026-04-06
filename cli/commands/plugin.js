import { pluginManager, togglePlugin } from '../plugins/index.js';
import { renderDivider, renderError } from '../ui/prompt.js';
import { state } from '../state/index.js';
import chalk from 'chalk';

export async function pluginCommand(args) {
  const action = args[0] || 'list';

  console.log();
  console.log(renderDivider('Plugin Manager'));

  if (action === 'list') {
    console.log(chalk.cyan('Built-in Plugins:'));
    state.plugins.forEach(p => {
      const status = p.enabled ? chalk.green('[ON]') : chalk.red('[OFF]');
      console.log(`  ${status} ${p.id} (${p.type})`);
    });
    
    console.log(chalk.cyan('\nUser Plugins (from ~/.kshyara/plugins/):'));
    if (pluginManager.plugins.length === 0) {
      console.log(chalk.gray('  No user plugins loaded.'));
    } else {
      pluginManager.plugins.forEach(p => {
        console.log(chalk.green(`  - ${p.name}`) + (p.description ? chalk.gray(`: ${p.description}`) : ''));
        if (p.commands) {
          console.log(chalk.dim(`    Commands: ${Object.keys(p.commands).join(', ')}`));
        }
      });
    }
  } else if (action === 'toggle') {
    const id = args[1];
    if (!id) {
      console.log(renderError('Usage: /plugin toggle <id>'));
      return;
    }
    const newState = togglePlugin(id);
    if (newState !== null) {
      console.log(chalk.green(`Plugin ${id} is now ${newState ? 'ON' : 'OFF'}.`));
    } else {
      console.log(renderError(`Plugin ${id} not found.`));
    }
  } else {
    console.log(renderError(`Unknown action: ${action}. Usage: /plugin [list|toggle]`));
  }
  console.log();
}
