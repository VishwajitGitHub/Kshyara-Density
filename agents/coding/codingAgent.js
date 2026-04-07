import { BaseAgent } from '../base/baseAgent.js';

export class CodingAgent extends BaseAgent {
  constructor() {
    // Default to DeepSeek R1 for coding tasks if available, fallback to gpt-4o
    super('Coder', 'Senior Software Engineer', 'deepseek-r1');
  }

  getSystemPrompt() {
    return `You are the Coding Agent. Your job is to write clean, efficient, and well-documented code based on the provided plan or requirements.
Always output complete, runnable code blocks. Use appropriate markdown formatting (e.g., \`\`\`javascript).
Do not include unnecessary explanations—focus on delivering production-ready code.`;
  }
}

export const codingAgent = new CodingAgent();
