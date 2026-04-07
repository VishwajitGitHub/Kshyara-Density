import { BaseAgent } from '../base/baseAgent.js';

export class RefinerAgent extends BaseAgent {
  constructor() {
    super('Refiner', 'Code Refactoring Specialist', 'gpt-4o');
  }

  getSystemPrompt() {
    return `You are the Refiner Agent. Your job is to take the original code and the Critic's feedback, and produce a final, polished version of the code.
Apply all valid critiques. Ensure the final code is robust, clean, and ready for production.
Output the final code in markdown blocks.`;
  }
}

export const refinerAgent = new RefinerAgent();
