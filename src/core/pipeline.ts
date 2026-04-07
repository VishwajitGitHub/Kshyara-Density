import { Renderer } from '../ui/renderer.js';
import { IntelligentRouter } from '../router/intelligentRouter.js';
import { RouterDecision } from '../router/types.js';
import { toolRegistry } from '../tools/registry.js';
import { initializeTools } from '../tools/index.js';
import { agentSwarm } from '../agents/swarm.js';
import { PlannerAgent, CoderAgent } from '../agents/specialized.js';
import { autonomyEngine } from './autonomy.js';
import { brain } from '../brain/context.js';
import { memoryStore } from '../memory/store.js';
import { policyEngine } from '../sandbox/policy.js';
import { simulator, evolutionEngine } from '../simulator/engine.js';
import { LazyToolLoader } from '../tools/lazyLoader.js';

export interface PipelineContext {
  input: string;
  command?: string;
  agentName?: string;
  task?: string;
  args?: string[];
  response?: string;
  error?: Error;
  startTime: number;
  routing?: RouterDecision;
}

export class CorePipeline {
  private router = new IntelligentRouter();

  constructor() {
    initializeTools();
    this.initializeAgents();
  }

  private initializeAgents() {
    agentSwarm.register(new PlannerAgent());
    agentSwarm.register(new CoderAgent());
  }

  public async execute(input: string): Promise<void> {
    const context: PipelineContext = {
      input,
      startTime: Date.now()
    };

    brain.addMessage('user', input);

    try {
      await this.preprocess(context);
      await this.route(context);
      await this.process(context);
      await this.postprocess(context);
      this.render(context);
      
      if (context.response) {
        brain.addMessage('assistant', context.response);
      }
    } catch (err: any) {
      context.error = err;
      Renderer.error(`Pipeline failure: ${err.message}`);
    }
  }

  private async preprocess(ctx: PipelineContext) {
    if (ctx.input.startsWith('/')) {
      const parts = ctx.input.slice(1).split(' ');
      ctx.command = parts[0];
      ctx.args = parts.slice(1);
    } else if (ctx.input.startsWith('@')) {
      const parts = ctx.input.slice(1).split(' ');
      ctx.agentName = parts[0];
      ctx.task = parts.slice(1).join(' ');
    }
  }

  private async route(ctx: PipelineContext) {
    if (!ctx.command && !ctx.agentName) {
      ctx.routing = this.router.route(ctx.input);
    }
  }

  private async process(ctx: PipelineContext) {
    if (ctx.command) {
      switch (ctx.command) {
        case 'help': ctx.response = this.getHelp(); break;
        case 'tools': ctx.response = this.listTools(); break;
        case 'agents': ctx.response = this.listAgents(); break;
        case 'agent': ctx.response = await this.handleAutonomousTask(ctx.args?.join(' ')); break;
        case 'run': ctx.response = await this.runTool(ctx.args); break;
        case 'memory': ctx.response = this.handleMemory(ctx.args); break;
        case 'security': ctx.response = this.getSecurityInfo(); break;
        case 'simulate': ctx.response = await this.handleSimulation(ctx.args?.join(' ')); break;
        case 'evolve': ctx.response = await this.handleEvolution(ctx.args?.join(' ')); break;
        case 'status': ctx.response = this.getStatus(); break;
        case 'exit': process.exit(0); break;
        default: ctx.response = `Unknown command '/${ctx.command}'.`;
      }
    } else if (ctx.agentName) {
      ctx.response = await this.handleAgentTask(ctx.agentName, ctx.task);
    } else if (ctx.routing) {
      ctx.response = `Routed to \x1b[36m${ctx.routing.model.name}\x1b[0m (\x1b[33m${ctx.routing.model.tier}\x1b[0m)\n    Reason: ${ctx.routing.reason}`;
    }
  }

  private getStatus(): string {
    const stats = LazyToolLoader.getScaleStats();
    return `
\x1b[1mKshyara Final System Status (Phase 10):\x1b[0m
  Architecture:  \x1b[32mMulti-Agent / Multi-Model (Optimized)\x1b[0m
  Tools Scaled:  \x1b[36m${stats.totalTools}\x1b[0m (Lazy-loading enabled)
  Categories:    ${stats.activeCategories.length || 'Base Core'}
  Memory System: \x1b[32mActive (Vector + Context)\x1b[0m
  Security:      \x1b[32mPolicyEngine Active\x1b[0m
  Autonomous:    \x1b[32mEnabled (AutonomyEngine v2.0)\x1b[0m
    `.trim();
  }

  private async handleSimulation(task?: string): Promise<string> {
    if (!task) return 'Usage: /simulate <task>';
    const result = await simulator.runSimulation(task);
    return `Simulation Complete:\n  Estimated Cost: $${result.estimatedCost}\n  Latency: ${result.estimatedLatency}s\n  ${result.resourceUsage}`;
  }

  private async handleEvolution(text?: string): Promise<string> {
    if (!text) return 'Usage: /evolve <initial_text>';
    return await evolutionEngine.refineResponse(text);
  }

  private getSecurityInfo(): string {
    return `
\x1b[1mKshyara Security Policy:\x1b[0m
  Shell Access:  \x1b[32mEnabled\x1b[0m
  Path Locking:  \x1b[33mActive\x1b[0m (Restricts system paths)
  Blocked Cmds:  rm -rf, format, mkfs
    `.trim();
  }

  private handleMemory(args?: string[]): string {
    if (!args || args.length === 0) {
      const entries = memoryStore.getAll();
      let output = `\x1b[1mKnowledge Store (${entries.length} entries):\x1b[0m\n`;
      entries.slice(-5).forEach(e => output += `  \x1b[90m[${e.id}]\x1b[0m ${e.text.substring(0, 50)}...\n`);
      return output;
    }

    if (args[0] === 'save') {
      const text = args.slice(1).join(' ');
      memoryStore.store(text);
      return 'Knowledge saved successfully.';
    }

    if (args[0] === 'query') {
      const results = memoryStore.query(args[1]);
      let output = `\x1b[1mSearch Results for "${args[1]}":\x1b[0m\n`;
      results.forEach(e => output += `  \x1b[36m[${e.id}]\x1b[0m ${e.text}\n`);
      return output;
    }

    return 'Usage: /memory [save <text> | query <keyword>]';
  }

  private async handleAutonomousTask(task?: string): Promise<string> {
    if (!task) return 'Usage: /agent <task>';
    const result = await autonomyEngine.executeTask(task);
    return `Autonomous Task Result:\n${result.output}\n\nSteps Completed: ${result.steps.length}`;
  }

  private async handleAgentTask(name: string, task?: string): Promise<string> {
    if (!task) return `Usage: @${name} <task>`;
    const agent = agentSwarm.getAgent(name);
    if (!agent) return `Agent '${name}' not found.`;
    
    Renderer.info(`Spawning agent: ${agent.metadata.name}...`);
    return await agent.processTask(task);
  }

  private listAgents(): string {
    const agents = agentSwarm.listAgents();
    let output = '\x1b[1mRegistered Agents:\x1b[0m\n';
    agents.forEach(a => {
      output += `  \x1b[35m${a.name.padEnd(15)}\x1b[0m \x1b[90m(${a.role})\x1b[0m - ${a.description}\n`;
    });
    return output;
  }

  private async runTool(args?: string[]): Promise<string> {
    if (!args || args.length === 0) return 'Usage: /run <tool_name> <json_args>';
    const toolName = args[0];
    const tool = toolRegistry.getTool(toolName);
    if (!tool) return `Tool '${toolName}' not found.`;

    try {
      const toolArgs = args[1] ? JSON.parse(args.slice(1).join(' ')) : {};
      
      // Phase 8: Security Validation
      if (!policyEngine.validateToolUse(toolName, toolArgs)) {
        return `Security Rejection: Execution of '${toolName}' denied by policy.`;
      }

      Renderer.info(`Executing tool: ${toolName}...`);
      const result = await tool.execute(toolArgs);
      return `Tool Result:\n${result}`;
    } catch (err: any) {
      return `Tool Execution Error: ${err.message}`;
    }
  }

  private listTools(): string {
    const tools = toolRegistry.listTools();
    let output = '\x1b[1mRegistered Tools:\x1b[0m\n';
    tools.forEach(t => {
      output += `  \x1b[36m${t.name.padEnd(15)}\x1b[0m \x1b[90m(${t.category})\x1b[0m - ${t.description}\n`;
    });
    return output;
  }

  private async postprocess(ctx: PipelineContext) {
    // Finalization hooks
  }

  private render(ctx: PipelineContext) {
    if (ctx.response) {
      if (ctx.command || ctx.agentName) {
         console.log(`\n  ${ctx.response}\n`);
      } else {
         Renderer.box(ctx.response, ctx.routing?.model.name);
      }
    }

    const modelName = ctx.routing?.model.name || 'Core';
    const status = ctx.command ? `Executing /${ctx.command}` : (ctx.agentName ? `Agent ${ctx.agentName}` : 'Idle');
    Renderer.statusBar(status, modelName, Math.floor(Math.random() * 500)); // Simulated tokens
  }

  private getHelp(): string {
    return `
Available Commands (Phase 10 — SCALE ACTIVE):
  /help               Show this menu
  /status             Show final system status & scale
  /tools              List all registered tools
  /agents             List all registered agents
  /agent <task>       Trigger autonomous agent swarm loop
  /simulate <task>    Run load/cost simulation
  /evolve <text>      Self-refine response via Evolution Engine
  /memory <cmd>       Manage knowledge (save/query)
  /security           View current security policies
  /run <tool> <args>  Execute a tool manually
  @<agent> <task>     Send a task to a specific agent
  /exit               Quit Kshyara
    `.trim();
  }
}
