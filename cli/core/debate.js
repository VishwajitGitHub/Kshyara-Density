import { getAllModelResponses } from '../utils/ai.js';
import { state } from '../state/index.js';
import { renderDivider, getGrad, renderAIPrefix } from '../ui/prompt.js';
import chalk from 'chalk';

const DEBATE_CRITIQUES = [
  "I disagree with the premise. The approach is too naive.",
  "While technically correct, this solution doesn't scale well.",
  "There is a security vulnerability in this logic.",
  "This is over-engineered. A simpler approach exists."
];

const REBUTTALS = [
  "I see your point, but in practice the performance impact is negligible.",
  "That is a valid concern. I would update my solution to address it by adding input validation."
];

export async function runDebate(prompt, opts = {}) {
  const theme = state.getThemeColors();
  const g = getGrad();
  
  console.log();
  console.log(renderDivider('Debate Engine Running'));
  console.log(chalk.hex(theme.mutedDim)('  Models are formulating positions...'));
  
  const responses = await getAllModelResponses(prompt);
  const models = responses.map(r => r.metadata.model);
  
  // Round 0: Positions & Critiques
  for (let i = 0; i < responses.length; i++) {
    const r = responses[i];
    console.log();
    console.log(renderAIPrefix(r.metadata.model, '⚖️') + chalk.hex(theme.mutedDim)('[Position]'));
    console.log(chalk.hex(theme.text)(r.content));
    
    if (i < responses.length - 1) {
      const critic = models[(i + 1) % models.length];
      const critique = DEBATE_CRITIQUES[Math.floor(Math.random() * DEBATE_CRITIQUES.length)];
      console.log();
      console.log(renderAIPrefix(critic, '🤺') + chalk.hex(theme.error)('[Critique]'));
      console.log(chalk.hex(theme.text)(critique));
    }
  }
  
  // Round 1: Rebuttals
  console.log();
  console.log(renderDivider('Rebuttal Round'));
  for (let i = 0; i < responses.length; i++) {
    const r = responses[i];
    const rebuttal = REBUTTALS[Math.floor(Math.random() * REBUTTALS.length)];
    console.log();
    console.log(renderAIPrefix(r.metadata.model, '🛡️') + chalk.hex(theme.accent)('[Rebuttal]'));
    console.log(chalk.hex(theme.text)(rebuttal));
  }
  
  // Scoring
  console.log();
  console.log(renderDivider('Verdict'));
  responses.forEach(r => {
    r.debateScore = r.metadata.confidence * 60 + (r.content.length / 20) + (Math.random() * 15);
  });
  responses.sort((a, b) => b.debateScore - a.debateScore);
  
  console.log();
  console.log(`  🏆 ${chalk.hex(theme.primary).bold('Winner:')} ${chalk.hex(theme.text)(responses[0].metadata.model)} (${responses[0].debateScore.toFixed(1)} pts)`);
  console.log(`  🥈 ${chalk.hex(theme.secondary)('Runner-up:')} ${chalk.hex(theme.text)(responses[1].metadata.model)} (${responses[1].debateScore.toFixed(1)} pts)`);
  console.log();
}
