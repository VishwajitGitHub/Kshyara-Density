import { getAllModelResponses, streamResponse } from '../utils/ai.js';
import { state } from '../state/index.js';
import { printTable, streamOutput } from '../ui/output.js';
import { renderDivider, renderAIPrefix } from '../ui/prompt.js';
import chalk from 'chalk';

export async function runCombiner(prompt, opts = {}) {
  const theme = state.getThemeColors();
  const activeModels = state.getActiveModels();
  
  if (activeModels.length < 2) {
    console.log(chalk.hex(theme.error)('  Combiner requires at least 2 active models. Use /models to enable more.'));
    return;
  }
  
  console.log();
  console.log(renderDivider('Combiner Engine Running'));
  console.log(chalk.hex(theme.mutedDim)('  Querying all models in parallel...'));
  
  const responses = await getAllModelResponses(prompt);
  
  console.log();
  const headers = ['Model', 'Tokens', 'Latency (ms)'];
  const rows = responses.map((r) => [
    r.metadata.model,
    r.metadata.tokens,
    r.metadata.latency
  ]);
  printTable(headers, rows);
  
  console.log();
  console.log(chalk.hex(theme.mutedDim)('  Synthesizing responses...'));
  console.log();
  
  // Use the primary model to synthesize
  const synthesizer = activeModels[0];
  console.log(renderAIPrefix(synthesizer.name, '🧠') + chalk.hex(theme.accent)(' [Synthesized Output]'));
  
  let synthesisPrompt = `You are a Combiner Agent. The user asked: "${prompt}"\n\nHere are the responses from different AI models:\n\n`;
  responses.forEach((r, i) => {
    synthesisPrompt += `--- Model ${i+1} (${r.metadata.model}) ---\n${r.content}\n\n`;
  });
  synthesisPrompt += `Please synthesize these responses into a single, comprehensive, and highly accurate final answer. Take the best parts of each response.`;
  
  const gen = streamResponse(synthesisPrompt, { model: synthesizer.id });
  await streamOutput(gen);
  
  console.log();
  console.log(chalk.hex(theme.mutedDim)(`  Combined from ${responses.length} models.`));
  console.log();
}
