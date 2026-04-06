import { state } from '../state/index.js';
import { printTable, printBox } from '../ui/output.js';

export async function costCommand(args) {
  const models = state.activeModels;
  
  const headers = ['Model', 'Provider', 'Cost / 1K Tokens'];
  const rows = models.map(m => [m.name, m.provider, `$${m.costPer1k.toFixed(4)}`]);
  
  console.log();
  printTable(headers, rows);
  
  printBox('Session Summary', [
    `Messages Sent: ${state.session.messageCount}`,
    `Total Tokens:  ${state.session.totalTokens}`,
    `Total Cost:    $${state.session.totalCost.toFixed(4)}`,
    `Uptime:        ${state.getUptime()}`
  ]);
  console.log();
}
