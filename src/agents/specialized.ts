import { BaseAgent, AgentMetadata } from './swarm.js';

export class PlannerAgent extends BaseAgent {
  metadata: AgentMetadata = {
    name: 'Planner',
    role: 'Architect & Strategist',
    description: 'Decomposes complex goals into actionable sub-tasks.',
    modelTier: 'reasoning',
    tools: ['read_file', 'shell']
  };

  async processTask(task: string): Promise<string> {
    return `[Planner] Goal: "${task}". 
1. Research existing codebase.
2. Draft implementation plan.
3. Delegate coding to Coder Agent.`;
  }
}

export class CoderAgent extends BaseAgent {
  metadata: AgentMetadata = {
    name: 'Coder',
    role: 'Software Engineer',
    description: 'Writes and refactors high-quality code.',
    modelTier: 'coding',
    tools: ['read_file', 'write_file', 'shell']
  };

  async processTask(task: string): Promise<string> {
    return `[Coder] Implementing logic for: "${task}".
Code blocks will be generated and verified in sandbox.`;
  }
}
