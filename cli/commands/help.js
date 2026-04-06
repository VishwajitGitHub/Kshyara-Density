import { commands } from './index.js';
import { printTable, printBox } from '../ui/output.js';
import { renderSectionHeader } from '../ui/prompt.js';

export async function helpCommand(args) {
  const cmdName = args[0];

  if (cmdName) {
    const name = cmdName.startsWith('/') ? cmdName : `/${cmdName}`;
    const cmd = commands[name];
    if (cmd) {
      printBox(`Command: ${name}`, [
        `Description: ${cmd.description}`,
        `Usage:       ${cmd.usage}`,
        `Aliases:     ${cmd.alias ? cmd.alias.join(', ') : 'None'}`
      ]);
    } else {
      console.log(`Unknown command: ${name}`);
    }
    return;
  }

  console.log();
  console.log(renderSectionHeader('KSHYARA CLI Reference'));
  console.log();

  const headers = ['Command', 'Aliases', 'Description'];
  const rows = Object.entries(commands).map(([name, def]) => [
    name,
    def.alias ? def.alias.join(', ') : '',
    def.description
  ]);

  printTable(headers, rows);

  console.log(renderSectionHeader('Keyboard Shortcuts'));
  console.log();
  const shortcuts = [
    ['Ctrl+C', 'Cancel current request / Exit prompt'],
    ['Ctrl+D', 'Show exit hint'],
    ['Ctrl+L', 'Clear screen and show banner'],
    ['Ctrl+M', 'Cycle modes (Chat -> Command -> Debug)'],
    ['Ctrl+K', 'Open Command Palette'],
    ['Ctrl+I', 'Inspect last execution pipeline'],
    ['Ctrl+E', 'Export current session']
  ];
  printTable(['Shortcut', 'Action'], shortcuts);
}
