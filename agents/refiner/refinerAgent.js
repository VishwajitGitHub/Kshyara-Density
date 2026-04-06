import { BaseAgent } from '../base/baseAgent.js';

export class RefinerAgent extends BaseAgent {
  constructor() {
    super('Refiner', 'Code and Output Polisher', 'gpt-4o');
  }

  getSystemPrompt() {
    return `You are the Refiner Agent. Take the original output and the critic's feedback, and produce a final, polished, perfectly working version. Apply all suggested fixes and ensure the result is production-ready.`;
  }
}

export const refinerAgent = new RefinerAgent();
