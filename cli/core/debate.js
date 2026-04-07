import { streamResponse } from '../utils/ai.js';
import { state } from '../state/index.js';
import { renderDivider, renderAIPrefix } from '../ui/prompt.js';
import { streamOutput } from '../ui/output.js';
import chalk from 'chalk';

export async function runDebate(prompt, opts = {}) {
  const theme = state.getThemeColors();
  const activeModels = state.getActiveModels();
  
  if (activeModels.length < 2) {
    console.log(chalk.hex(theme.error)('  Debate requires at least 2 active models. Use /models to enable more.'));
    return;
  }

  const modelA = activeModels[0];
  const modelB = activeModels[1];
  
  console.log();
  console.log(renderDivider('Debate Engine Running'));
  console.log(chalk.hex(theme.mutedDim)(`  Topic: ${prompt}`));
  console.log(chalk.hex(theme.mutedDim)(`  Debaters: ${modelA.name} vs ${modelB.name}`));
  
  // Round 1: Model A Position
  console.log();
  console.log(renderAIPrefix(modelA.name, '⚖️') + chalk.hex(theme.mutedDim)(' [Opening Statement]'));
  const posAGen = streamResponse(`You are debating a topic. Provide your opening statement and position on: "${prompt}". Keep it concise (under 150 words).`, { model: modelA.id });
  const posA = await streamOutput(posAGen);
  
  // Round 2: Model B Critique
  console.log();
  console.log(renderAIPrefix(modelB.name, '🤺') + chalk.hex(theme.error)(' [Critique]'));
  const critBGen = streamResponse(`You are debating the topic: "${prompt}".\n\nYour opponent argued:\n"${posA}"\n\nProvide a strong critique of their argument. Keep it concise (under 150 words).`, { model: modelB.id });
  const critB = await streamOutput(critBGen);
  
  // Round 3: Model A Rebuttal
  console.log();
  console.log(renderAIPrefix(modelA.name, '🛡️') + chalk.hex(theme.accent)(' [Rebuttal]'));
  const rebAGen = streamResponse(`You are debating the topic: "${prompt}".\n\nYour opening statement:\n"${posA}"\n\nYour opponent's critique:\n"${critB}"\n\nProvide a strong rebuttal to defend your position. Keep it concise (under 150 words).`, { model: modelA.id });
  const rebA = await streamOutput(rebAGen);

  // Round 4: Judge
  const judgeModel = activeModels.length > 2 ? activeModels[2] : modelA;
  console.log();
  console.log(renderDivider('Verdict'));
  console.log(renderAIPrefix(judgeModel.name, '👨‍⚖️') + chalk.hex(theme.warning)(' [Judge]'));
  
  const judgeGen = streamResponse(`You are the judge of a debate on the topic: "${prompt}".\n\nDebater 1 (${modelA.name}):\nOpening: "${posA}"\nRebuttal: "${rebA}"\n\nDebater 2 (${modelB.name}):\nCritique: "${critB}"\n\nWho won the debate and why? Keep it concise.`, { model: judgeModel.id });
  await streamOutput(judgeGen);
  console.log();
}
