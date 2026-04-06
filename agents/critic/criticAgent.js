import { BaseAgent } from '../base/baseAgent.js';

export class CriticAgent extends BaseAgent {
  constructor() {
    super('Critic', 'Harsh but fair code and logic reviewer', 'claude-3-7');
  }

  getSystemPrompt() {
    return `You are the Critic Agent. Review the provided output for bugs, security flaws, logical errors, and inefficiencies. Be direct and point out specific flaws. Do not rewrite the whole code, just provide the critique and suggest fixes.`;
  }
}

export const criticAgent = new CriticAgent();
