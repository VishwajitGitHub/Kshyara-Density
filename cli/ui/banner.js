import chalk from 'chalk';
import gradient from 'gradient-string';
import { state, THEMES } from '../state/index.js';

const KSHYARA_ASCII = [
  ' ██╗  ██╗███████╗██╗  ██╗██╗   ██╗ █████╗ ██████╗  █████╗ ',
  ' ██║ ██╔╝██╔════╝██║  ██║╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗',
  ' █████╔╝ ███████╗███████║ ╚████╔╝ ███████║██████╔╝███████║',
  ' ██╔═██╗ ╚════██║██╔══██║  ╚██╔╝  ██╔══██║██╔══██╗██╔══██║',
  ' ██║  ██╗███████║██║  ██║   ██║   ██║  ██║██║  ██║██║  ██║',
  ' ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝',
];

function getGradient() {
  return gradient(state.getThemeColors().gradient);
}

export function printBanner() {
  const g = getGradient();
  console.log();
  KSHYARA_ASCII.forEach(line => console.log(g(line)));
  console.log();
  console.log(chalk.hex(state.getThemeColors().mutedDim)('  v1.0.0 • Multi-Model AI Orchestrator'));
  console.log();
}

export function printSystemCheck() {
  const theme = state.getThemeColors();
  const models = state.getActiveModels();
  console.log(chalk.hex(theme.mutedDim)(`  System Check:`));
  console.log(chalk.hex(theme.mutedDim)(`  • Models: ${models.length} active`));
  console.log(chalk.hex(theme.mutedDim)(`  • Plugins: ${state.plugins.length} loaded`));
  console.log();
}

export function printWelcome() {
  printBanner();
  printSystemCheck();
  const theme = state.getThemeColors();
  console.log(chalk.hex(theme.primary)('  Type /help for commands, or just start typing.'));
  console.log();
}

export function printModeChange(mode) {
  const theme = state.getThemeColors();
  console.log(chalk.hex(theme.accent)(`\n  [Mode changed to: ${mode.toUpperCase()}]\n`));
}
