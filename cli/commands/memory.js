import { state } from '../state/index.js';
import { printTable } from '../ui/output.js';
import { renderError, renderSuccess, renderDivider } from '../ui/prompt.js';
import { searchLongTermMemory, saveLongTermMemory, getAllLongTermMemories } from '../../memory/long-term/longTermMemory.js';
import chalk from 'chalk';

export async function memoryCommand(args) {
  const subcmd = args[0] || 'list';
  const theme = state.getThemeColors();

  if (subcmd === 'list') {
    console.log();
    console.log(renderDivider('Session Memory'));
    if (state.memory.length === 0) {
      console.log(chalk.hex(theme.mutedDim)('  Session memory is empty.'));
    } else {
      printTable(['Key', 'Value'], state.memory.map(m => [m.key, m.value]));
    }
    
    console.log();
    console.log(renderDivider('Long-Term Memory'));
    const ltm = getAllLongTermMemories();
    if (ltm.length === 0) {
      console.log(chalk.hex(theme.mutedDim)('  Long-term memory is empty.'));
    } else {
      ltm.slice(-5).forEach(m => {
        console.log(`  [${m.id}] ${chalk.gray(new Date(m.timestamp).toLocaleDateString())}: ${m.content.substring(0, 50)}...`);
      });
      if (ltm.length > 5) console.log(chalk.gray(`  ... and ${ltm.length - 5} more. Use /memory search <query> to find them.`));
    }
    console.log();
    return;
  }

  if (subcmd === 'set') {
    const key = args[1];
    const val = args.slice(2).join(' ');
    if (!key || !val) return console.log(renderError('Usage: /memory set <key> <value>'));
    
    state.updateMemory(key, val);
    
    console.log(renderSuccess(`Saved to session memory: ${key}`));
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
    console.log(renderSuccess('Session memory cleared.'));
    return;
  }
  
  if (subcmd === 'save') {
    const note = args.slice(1).join(' ');
    if (!note) return console.log(renderError('Usage: /memory save <note>'));
    
    const saved = saveLongTermMemory(note, ['memory-cmd']);
    console.log(renderSuccess(`Saved to long-term memory (ID: ${saved.id})`));
    return;
  }
  
  if (subcmd === 'search') {
    const query = args.slice(1).join(' ');
    if (!query) return console.log(renderError('Usage: /memory search <query>'));
    
    const results = searchLongTermMemory(query);
    console.log();
    console.log(renderDivider(`Search Results: "${query}"`));
    if (results.length === 0) {
      console.log(chalk.yellow(`  No long-term memories found.`));
    } else {
      results.forEach(m => {
        console.log(`\n  [${m.id}] ${chalk.gray(new Date(m.timestamp).toLocaleString())}`);
        console.log(`  ${chalk.hex(theme.text)(m.content)}`);
      });
    }
    console.log();
    return;
  }

  console.log(renderError(`Unknown memory subcommand: ${subcmd}. Usage: /memory [list|set|get|clear|save|search]`));
}
