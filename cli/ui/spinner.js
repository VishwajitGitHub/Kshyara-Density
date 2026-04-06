import ora from 'ora';
import chalk from 'chalk';
import { state } from '../state/index.js';

export function createSpinner(text) {
  const theme = state.getThemeColors();
  return ora({
    text: chalk.hex(theme.text)(text),
    color: 'cyan',
    spinner: 'dots',
  });
}

export function createThinkingSpinner() {
  const theme = state.getThemeColors();
  return ora({
    text: chalk.hex(theme.muted)('Thinking...'),
    spinner: {
      interval: 80,
      frames: ['◐', '◓', '◑', '◒'].map(f => chalk.hex(theme.primary)(f))
    }
  });
}

export function createProcessingSpinner(text) {
  const theme = state.getThemeColors();
  return ora({
    text: chalk.hex(theme.text)(text),
    spinner: {
      interval: 100,
      frames: ['▰▱▱▱▱', '▰▰▱▱▱', '▰▰▰▱▱', '▰▰▰▰▱', '▰▰▰▰▰'].map(f => chalk.hex(theme.accent)(f))
    }
  });
}
