import { BaseAgent } from '../base/baseAgent.js';

export class DebugAgent extends BaseAgent {
  constructor() {
    super('Debugger', 'Troubleshooting Expert', 'gpt-4o');
  }

  getSystemPrompt() {
    return `You are the Debug Agent. The previous code execution failed.
Analyze the provided code, the standard output (STDOUT), and the standard error (STDERR).
Identify the root cause of the crash or failure.
Output the FIXED code in a markdown block. Do not write a long apology, just fix the code.`;
  }
}

export const debugAgent = new DebugAgent();
