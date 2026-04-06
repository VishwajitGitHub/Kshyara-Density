import { getExecutionSteps } from '../utils/ai.js';
import { state } from '../state/index.js';
import { printBox } from '../ui/output.js';
import { renderSectionHeader } from '../ui/prompt.js';
import chalk from 'chalk';

export async function inspectCommand(args) {
  const steps = getExecutionSteps();
  const theme = state.getThemeColors();
  
  console.log();
  console.log(renderSectionHeader('Execution Pipeline Trace'));
  console.log();

  const totalTime = steps.reduce((sum, s) => sum + s.time, 0);
  
  steps.forEach(step => {
    const percent = step.time / totalTime;
    const barLen = Math.max(1, Math.floor(percent * 40));
    const bar = '█'.repeat(barLen);
    
    console.log(
      `  ${chalk.hex(theme.primary)(step.name.padEnd(20))} ` +
      `${chalk.hex(theme.accent)(bar.padEnd(40))} ` +
      `${chalk.hex(theme.mutedDim)(step.time + 'ms')}`
    );
  });
  
  console.log();
  printBox('Pipeline Stats', [
    `Total Time: ${totalTime}ms`,
    `Steps: ${steps.length}`,
    `Routed Model: ${state.activeModels[0].name}`,
    `Tokens Used: ${state.session.totalTokens}`
  ]);
  console.log();
}
