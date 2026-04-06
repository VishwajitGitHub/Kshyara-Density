import { state } from '../state/index.js';
import { printTable } from '../ui/output.js';
import { renderError, renderSuccess } from '../ui/prompt.js';
import chalk from 'chalk';

export async function modelsCommand(args) {
  const subcmd = args[0] || 'list';

  if (subcmd === 'list') {
    const headers = ['Status', 'ID', 'Name', 'Provider', 'Specialty', 'Confidence'];
    const rows = state.activeModels.map(m => {
      const status = m.active ? chalk.green('● Active') : chalk.gray('○ Inactive');
      const confBar = '█'.repeat(Math.floor(m.confidence * 10)).padEnd(10, '░');
      return [status, m.id, m.name, m.provider, m.specialty, confBar];
    });
    console.log();
    printTable(headers, rows);
    return;
  }

  if (subcmd === 'toggle') {
    const id = args[1];
    if (!id) return console.log(renderError('Usage: /models toggle <id>'));
    const model = state.getModelById(id);
    if (!model) return console.log(renderError(`Model not found: ${id}`));
    
    state.toggleModel(id);
    console.log(renderSuccess(`Model ${id} is now ${model.active ? 'Active' : 'Inactive'}`));
    return;
  }

  console.log(renderError(`Unknown models subcommand: ${subcmd}`));
}
