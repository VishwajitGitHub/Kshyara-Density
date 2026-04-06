import { markExplicitExit } from '../state/exitFlag.js';
import { saveSession } from '../config/index.js';
import { state } from '../state/index.js';
import chalk from 'chalk';

export async function exitCommand(args) {
  markExplicitExit();
  saveSession(state.session);
  const theme = state.getThemeColors();
  console.log();
  console.log(chalk.hex(theme.accent)('  Session saved. Goodbye!'));
  console.log();
  process.exit(0);
}
