import { BaseAgent } from '../base/baseAgent.js';

export class PlannerAgent extends BaseAgent {
  constructor() {
    super('Planner', 'Task Decomposition Specialist', 'gpt-4o');
  }

  getSystemPrompt() {
    return `You are the Planner Agent. Your job is to take a complex user request and break it down into a clear, sequential, actionable plan.
Output the plan as a numbered list. Be concise but comprehensive. Do not write code, only write the plan.`;
  }
}

export const plannerAgent = new PlannerAgent();
