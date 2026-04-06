import { getAllModelResponses, streamResponse } from '../utils/ai.js';
import { state } from '../state/index.js';
import { printTable } from '../ui/output.js';
import { renderDivider, getGrad } from '../ui/prompt.js';
import chalk from 'chalk';

function scoreResponse(resp) {
  let score = resp.metadata.confidence * 50;
  if (resp.content.includes('```')) score += 12;
  if (resp.content.length > 300) score += 10;
  if (resp.content.includes('→')) score += 5;
  return Math.min(score, 100);
}

function mergeResponses(responses) {
  const winner = responses[0];
  let merged = winner.content;
  
  // Simple mock merge: append unique lines
  const winnerLines = new Set(winner.content.split('\n'));
  for (let i = 1; i < responses.length; i++) {
    const lines = responses[i].content.split('\n');
    for (const line of lines) {
      if (line.trim() && !winnerLines.has(line)) {
        merged += '\n' + line;
        winnerLines.add(line);
      }
    }
  }
  return merged;
}

export async function runCombiner(prompt, opts = {}) {
  const theme = state.getThemeColors();
  const g = getGrad();
  
  console.log();
  console.log(renderDivider('Combiner Engine Running'));
  console.log(chalk.hex(theme.mutedDim)('  Querying all models in parallel...'));
  
  const responses = await getAllModelResponses(prompt);
  
  responses.forEach(r => {
    r.score = scoreResponse(r);
  });
  
  responses.sort((a, b) => b.score - a.score);
  
  console.log();
  const headers = ['Rank', 'Model', 'Score', 'Tokens'];
  const rows = responses.map((r, i) => [
    i === 0 ? '🥇 1st' : i === 1 ? '🥈 2nd' : i === 2 ? '🥉 3rd' : `${i+1}th`,
    r.metadata.model,
    r.score.toFixed(1),
    r.metadata.tokens
  ]);
  printTable(headers, rows);
  
  const merged = mergeResponses(responses);
  
  console.log(renderDivider('Merged Output'));
  console.log();
  console.log(chalk.hex(theme.text)(merged));
  console.log();
  console.log(chalk.hex(theme.mutedDim)(`  Combined from ${responses.length} models. Primary source: ${responses[0].metadata.model}`));
  console.log();
}
