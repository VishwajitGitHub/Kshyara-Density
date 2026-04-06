import chalk from 'chalk';
import { state } from '../state/index.js';
import { renderAIPrefix, renderDivider, getGrad } from './prompt.js';

export async function streamOutput(generator) {
  const theme = state.getThemeColors();
  let modelName = 'AI';
  
  for await (const event of generator) {
    if (event.type === 'start') {
      modelName = event.model || 'AI';
      process.stdout.write('\n' + renderAIPrefix(modelName));
    } else if (event.type === 'chunk') {
      process.stdout.write(chalk.hex(theme.text)(event.text));
    } else if (event.type === 'debug' && state.debug) {
      process.stdout.write(chalk.hex(theme.mutedDim)(`\n[DEBUG] ${event.data}\n`));
    } else if (event.type === 'end') {
      process.stdout.write('\n\n');
      if (state.verbose && event.metadata) {
        const { tokens, cost, latency } = event.metadata;
        process.stdout.write(chalk.hex(theme.mutedDim)(`  [Tokens: ${tokens} | Cost: $${cost.toFixed(4)} | Latency: ${latency}ms]\n\n`));
      }
    }
  }
}

export function printTable(headers, rows) {
  const theme = state.getThemeColors();
  const colWidths = headers.map((h, i) => Math.max(h.length, ...rows.map(r => String(r[i]).length)));
  
  const renderRow = (row, color) => {
    return '  ' + row.map((cell, i) => String(cell).padEnd(colWidths[i])).join('  │  ');
  };

  console.log(chalk.hex(theme.primary)(renderRow(headers)));
  console.log(chalk.hex(theme.mutedDim)('  ' + colWidths.map(w => '─'.repeat(w)).join('──┼──')));
  rows.forEach(row => console.log(chalk.hex(theme.text)(renderRow(row))));
  console.log();
}

export function printKeyValue(key, value, indent = 2) {
  const theme = state.getThemeColors();
  const pad = ' '.repeat(indent);
  console.log(`${pad}${chalk.hex(theme.primary)(key.padEnd(15))} ${chalk.hex(theme.text)(value)}`);
}

export function printBox(title, lines) {
  const theme = state.getThemeColors();
  const width = Math.max(title.length + 4, ...lines.map(l => l.length)) + 4;
  
  console.log(chalk.hex(theme.border)(`┌─ ${chalk.hex(theme.primary)(title)} ${'─'.repeat(width - title.length - 5)}┐`));
  lines.forEach(line => {
    console.log(chalk.hex(theme.border)('│ ') + chalk.hex(theme.text)(line.padEnd(width - 4)) + chalk.hex(theme.border)(' │'));
  });
  console.log(chalk.hex(theme.border)(`└${'─'.repeat(width - 2)}┘`));
}
