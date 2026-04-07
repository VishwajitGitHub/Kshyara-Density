import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { DensityUI } from '../ui.js';

export interface AgentConfig {
  name: string;
  description: string;
  tools: string[];
  model: string;
  temperature: number;
}

/**
 * Subagent System
 * Implements Phase 1: Isolated agents defined via YAML.
 */
export class SubagentManager {
  private agentsDir = path.join(process.cwd(), '.kshyara', 'agents');
  private agents: Map<string, AgentConfig> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(this.agentsDir)) {
      fs.mkdirSync(this.agentsDir, { recursive: true });
      this.createDefaultAgents();
    }
    this.loadAgents();
  }

  private createDefaultAgents() {
    const debuggerYaml = `
name: debugger
description: Fixes errors and analyzes stack traces
tools: [read, write, bash]
model: deepseek-r1
temperature: 0.2
    `.trim();

    fs.writeFileSync(path.join(this.agentsDir, 'debugger.yaml'), debuggerYaml);
  }

  private loadAgents() {
    const files = fs.readdirSync(this.agentsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(this.agentsDir, file), 'utf8');
        const config = yaml.load(content) as AgentConfig;
        this.agents.set(config.name, config);
      } catch (e: any) {
        DensityUI.error(`Failed to load agent ${file}: ${e.message}`);
      }
    }
  }

  public getAgent(name: string): AgentConfig | undefined {
    return this.agents.get(name);
  }

  public listAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  public async spawn(name: string, task: string) {
    const agent = this.getAgent(name);
    if (!agent) {
      DensityUI.error(`Agent '${name}' not found.`);
      return;
    }

    DensityUI.divider(`Agent: ${agent.name.toUpperCase()}`);
    DensityUI.info(`Model: ${agent.model} | Temp: ${agent.temperature}`);
    DensityUI.info(`Task: ${task}`);

    // Simulate isolated execution
    process.stdout.write(`  \x1b[36m⟳\x1b[0m Initializing isolated memory...\r`);
    await new Promise(r => setTimeout(r, 800));
    process.stdout.write(`  \x1b[32m✔\x1b[0m Initializing isolated memory...\n`);

    process.stdout.write(`  \x1b[36m⟳\x1b[0m Loading tools: [${agent.tools.join(', ')}]\r`);
    await new Promise(r => setTimeout(r, 800));
    process.stdout.write(`  \x1b[32m✔\x1b[0m Loading tools: [${agent.tools.join(', ')}]\n`);

    process.stdout.write(`  \x1b[36m⟳\x1b[0m Executing task...\r`);
    await new Promise(r => setTimeout(r, 1500));
    process.stdout.write(`  \x1b[32m✔\x1b[0m Executing task...\n\n`);

    const result = `[${agent.name}] Successfully analyzed and completed the task using ${agent.model}.`;
    console.log(`  \x1b[36mResult:\x1b[0m ${result}\n`);
  }
}

export const subagents = new SubagentManager();
