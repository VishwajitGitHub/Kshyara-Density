import { ModelConfig } from '../router/types.js';

export interface AgentMetadata {
  name: string;
  role: string;
  description: string;
  modelTier: 'reasoning' | 'coding' | 'fast';
  tools: string[];
}

export abstract class BaseAgent {
  abstract metadata: AgentMetadata;
  
  public async processTask(task: string): Promise<string> {
    // Phase 4: Basic task processing
    // Phase 5: Autonomous loop
    return `[${this.metadata.name}] I am ready to perform the task: ${task}`;
  }
}

export class AgentSwarm {
  private agents: Map<string, BaseAgent> = new Map();

  public register(agent: BaseAgent) {
    this.agents.set(agent.metadata.name.toLowerCase(), agent);
  }

  public getAgent(name: string): BaseAgent | undefined {
    return this.agents.get(name.toLowerCase());
  }

  public listAgents(): AgentMetadata[] {
    return Array.from(this.agents.values()).map(a => a.metadata);
  }
}

export const agentSwarm = new AgentSwarm();
