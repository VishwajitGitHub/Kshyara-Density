import { state } from '../state/index.js';
import { printTable } from '../ui/output.js';
import { renderError, renderSuccess } from '../ui/prompt.js';

export async function memoryCommand(args) {
  const subcmd = args[0] || 'list';

  if (subcmd === 'list') {
    if (state.memory.length === 0) {
      console.log(renderSuccess('Memory is empty.'));
      return;
    }
    printTable(['Key', 'Value'], state.memory.map(m => [m.key, m.value]));
    return;
  }

  if (subcmd === 'set') {
    const key = args[1];
    const val = args.slice(2).join(' ');
    if (!key || !val) return console.log(renderError('Usage: /memory set <key> <value>'));
    
    state.updateMemory(key, val);
    
    console.log(renderSuccess(`Saved to memory: ${key}`));
    return;
  }

  if (subcmd === 'get') {
    const key = args[1];
    if (!key) return console.log(renderError('Usage: /memory get <key>'));
    const val = state.getMemory(key);
    if (val) console.log(renderSuccess(`${key}: ${val}`));
    else console.log(renderError(`Key not found: ${key}`));
    return;
  }

  if (subcmd === 'clear') {
    state.clearMemory();
    console.log(renderSuccess('Memory cleared.'));
    return;
  }

  console.log(renderError(`Unknown memory subcommand: ${subcmd}`));
}
