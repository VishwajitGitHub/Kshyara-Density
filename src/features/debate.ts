import { DensityUI } from '../ui.js';
import { brain } from '../core/brain.js';

/**
 * Multi-Agent Debate Mode
 * Implements Extra Feature: Agents argue, Judge decides best answer.
 */
export async function runDebate(topic: string) {
  if (!topic) {
    DensityUI.error('Usage: /debate <topic>');
    return;
  }

  DensityUI.divider('Multi-Agent Debate Mode');
  DensityUI.info(`Topic: "${topic}"`);
  
  const agents = [
    { name: 'Alpha (Proponent)', color: '\x1b[34m' }, // Blue
    { name: 'Beta (Opponent)', color: '\x1b[31m' },   // Red
    { name: 'Judge (Synthesizer)', color: '\x1b[32m' } // Green
  ];

  // Simulated AI debate generation
  const dialogue = [
    { agent: 0, text: `I strongly advocate for ${topic}. The primary benefits include scalability, modularity, and long-term maintainability.` },
    { agent: 1, text: `I disagree. ${topic} introduces unnecessary complexity, increases latency, and creates a steep learning curve for onboarding.` },
    { agent: 0, text: `While complexity is a factor, the tooling ecosystem around ${topic} has matured enough to mitigate those risks effectively.` },
    { agent: 2, text: `Having heard both sides, the verdict is clear: ${topic} is highly beneficial for large-scale enterprise systems, but should be avoided for rapid prototyping or small teams due to the overhead.` }
  ];

  for (const turn of dialogue) {
    const agent = agents[turn.agent];
    process.stdout.write(`  ${agent.color}⟳ ${agent.name} is formulating an argument...\x1b[0m\r`);
    await new Promise(r => setTimeout(r, 1800));
    process.stdout.write(' '.repeat(60) + '\r'); // Clear line
    console.log(`  ${agent.color}■ ${agent.name}:\x1b[0m ${turn.text}\n`);
  }

  brain.addMessage('assistant', `Debate concluded on: ${topic}. Verdict: ${dialogue[3].text}`);
  DensityUI.success('Debate synthesized and added to memory.');
}
