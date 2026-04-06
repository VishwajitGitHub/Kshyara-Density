import chalk from 'chalk';
import gradient from 'gradient-string';
import { state, MODES } from '../state/index.js';

export function getGrad() { return gradient(state.getThemeColors().gradient); }

export function getPromptPrefix() {
  const theme = state.getThemeColors();
  const modeStr = state.mode === MODES.CHAT ? 'chat' : state.mode === MODES.COMMAND ? 'cmd' : 'dbg';
  return `${getGrad()('◆')} ${chalk.hex(theme.mutedDim)(`[${modeStr}]`)} ${chalk.hex(theme.primary)('›')} `;
}

export function renderError(msg) {
  return `${chalk.hex(state.getThemeColors().error)('✖')} ${msg}`;
}

export function renderSuccess(msg) {
  return `${chalk.hex(state.getThemeColors().accent)('✔')} ${msg}`;
}

export function renderInfo(msg) {
  return `${chalk.hex(state.getThemeColors().primary)('ℹ')} ${msg}`;
}

export function renderWarning(msg) {
  return `${chalk.hex(state.getThemeColors().warning)('⚠')} ${msg}`;
}

export function renderAIPrefix(modelName, icon = '▸') {
  const theme = state.getThemeColors();
  return `${getGrad()(icon)} ${chalk.hex(theme.secondary)(modelName)} ${chalk.hex(theme.primary)('›')} `;
}

export function renderDivider(label) {
  const theme = state.getThemeColors();
  const line = '─'.repeat(40);
  return chalk.hex(theme.mutedDim)(`─── ${label} ${line}`);
}

export function renderSectionHeader(label) {
  const theme = state.getThemeColors();
  return `${getGrad()('▸')} ${chalk.hex(theme.text).bold(label)}\n${chalk.hex(theme.mutedDim)('────────')}`;
}

export function renderUserBubble(input) {
  const theme = state.getThemeColors();
  return `${chalk.hex(theme.primary)('You')} ${chalk.hex(theme.mutedDim)('›')} ${input}`;
}

export function renderTag(text, color) {
  return chalk.hex(color)(`[${text}]`);
}
