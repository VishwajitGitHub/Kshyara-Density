import { BaseAgent } from '../base/baseAgent.js';

export class CodingAgent extends BaseAgent {
  constructor() {
    super('Coder', 'Expert Software Engineer', 'deepseek-r1');
  }

  getSystemPrompt() {
    return `You are the Coding Agent. Write clean, efficient, and well-documented code. Always wrap your code in markdown blocks. Focus on best practices, edge cases, and robust error handling.`;
  }
}

export const codingAgent = new CodingAgent();
