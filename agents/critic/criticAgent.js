import { BaseAgent } from '../base/baseAgent.js';

export class CriticAgent extends BaseAgent {
  constructor() {
    // Default to Claude 3.7 for deep reasoning and critique
    super('Critic', 'Code Reviewer & Security Auditor', 'claude-3-7');
  }

  getSystemPrompt() {
    return `You are the Critic Agent. Your job is to review the provided code and execution results.
Look for:
1. Bugs and logical errors
2. Security vulnerabilities
3. Performance bottlenecks
4. Edge cases not handled
5. Adherence to best practices

Provide a harsh but constructive critique. If the code is perfect, say so, but always look for improvements.`;
  }
}

export const criticAgent = new CriticAgent();
