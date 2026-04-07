import readline from 'readline';
import { UI } from './ui.js';
import { brain } from './core/brain.js';
import { router } from './core/router.js';
import { subagents } from './core/subagent.js';
import { hooks } from './core/hooks.js';
import { intelligence } from './core/intelligence.js';
import { security } from './core/security.js';
import { personality } from './core/personality.js';
import { memory } from './core/memory.js';
import { researcher } from './tools/web-search.js';
import { mcpClient } from './mcp/client.js';
import { exportHistoryToMarkdown } from './features/export.js';
import { startOAuthFlow } from './features/oauth.js';
import { runAutonomousAgent } from './features/agent.js';
import { runDebate } from './features/debate.js';
import { showCostMonitor } from './features/monitor.js';
import { runSimulation } from './features/simulator.js';
import { wrapApi } from './features/api-wrapper.js';
import { runGitAssistant } from './features/git.js';
import { runAnalyzer } from './features/analyzer.js';

export class DensityApp {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: UI.getPrompt()
    });
  }

  public async initialize() {
    UI.printBanner();
    hooks.execute('SessionStart');
    
    // Inject personality and mistake memory into the brain's system prompt
    const systemContext = personality.getSystemPrompt() + memory.getMistakesContext();
    brain.addMessage('system', systemContext);

    this.setupEventHandlers();
    this.rl.prompt();
  }

  private setupEventHandlers() {
    this.rl.on('line', async (line) => {
      const input = line.trim();
      if (input) {
        await this.handleInput(input);
      }
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\n');
      hooks.execute('SessionEnd');
      UI.info('Shutting down Kshyara\\'s Density. Goodbye!');
      process.exit(0);
    });
  }

  private async handleInput(input: string) {
    // Handle special prefixes
    if (input.startsWith('!')) {
      return this.handleShellCommand(input.substring(1));
    }
    if (input.startsWith('@')) {
      return this.handleSubagentCommand(input.substring(1));
    }

    brain.addMessage('user', input);
    personality.adjustMood(input);

    const [cmd, ...args] = input.split(' ');

    try {
      switch (cmd.toLowerCase()) {
        case '/help':
          this.showHelp();
          break;
        case '/login':
          await startOAuthFlow();
          break;
        case '/export':
          exportHistoryToMarkdown(args[0]);
          break;
        case '/research':
          await researcher.research(args.join(' '));
          break;
        case '/agent':
          await runAutonomousAgent(args.join(' '));
          break;
        case '/debate':
          await runDebate(args.join(' '));
          break;
        case '/simulate':
          await runSimulation(args);
          break;
        case '/api':
          await wrapApi(args);
          break;
        case '/git':
          await runGitAssistant(args);
          break;
        case '/analyze':
          await runAnalyzer(args);
          break;
        case '/cost':
          showCostMonitor();
          break;
        case '/mcp':
          if (args[0] === 'connect') {
            await mcpClient.connect(args[1], args.slice(2).join(' '));
          } else {
            mcpClient.list();
          }
          break;
        case '/agents':
          if (args[0] === 'spawn') {
            await subagents.spawn(args[1], args.slice(2).join(' '));
          } else {
            console.log(subagents.listAgents());
          }
          break;
        case '/exit':
        case '/quit':
          this.rl.close();
          break;
        default:
          if (cmd.startsWith('/')) {
            UI.error(`Unknown command: ${cmd}. Type /help for available commands.`);
          } else {
            await this.simulateChatResponse(input);
          }
      }
    } catch (err: any) {
      UI.error(`An error occurred: ${err.message}`);
      // Auto-log mistakes to memory
      memory.recordMistake(`Failed executing command '${cmd}': ${err.message}`);
    }
  }

  private async handleShellCommand(cmd: string) {
    // Command Risk Detection
    if (!security.isCommandSafe(cmd)) {
      return; // Blocked by security engine
    }

    UI.info(`Executing shell command: ${cmd}`);
    // In a real app, use child_process.execSync here
    console.log(`\x1b[90m$ ${cmd}\n(Simulated output)\x1b[0m\n`);
  }

  private async handleSubagentCommand(input: string) {
    const [agentName, ...taskArgs] = input.split(' ');
    const task = taskArgs.join(' ');
    await subagents.spawn(agentName, task);
  }

  private async simulateChatResponse(input: string) {
    // Intent Prediction
    const predictedAction = intelligence.predictNextAction(input);
    if (predictedAction) {
      UI.info(`🔮 Intent Prediction: You might want to run \x1b[33m${predictedAction}\x1b[0m next.`);
    }

    // Auto Prompt Optimizer
    const optimizedPrompt = intelligence.optimizePrompt(input);

    // Route to the best model based on the prompt
    const model = router.route(optimizedPrompt);
    
    hooks.execute('PreResponse');
    
    process.stdout.write(`  \x1b[36m⟳\x1b[0m Generating response via ${model.id}...\r`);
    await new Promise(r => setTimeout(r, 1000));
    process.stdout.write(' '.repeat(50) + '\r'); // clear line

    const confidence = intelligence.calculateConfidence();
    const moodPrefix = personality.getMoodPrefix();

    const response = `${moodPrefix} I processed your optimized request using **${model.id}** (Tier: ${model.tier}).\n\nYour input was: "${input}".\n\nUse \`/help\` to explore my advanced capabilities like \`/research\` or \`/agent\`.\n\n\x1b[90m[Confidence Score: ${confidence}%]\x1b[0m`;
    
    brain.addMessage('assistant', response);
    console.log(`\n  \x1b[36mDensity\x1b[0m › ${response.replace(/\n/g, '\n    ')}\n`);
    
    hooks.execute('PostResponse');
  }

  private showHelp() {
    UI.divider('Density Commands');
    const commands = [
      { cmd: '/help', desc: 'Show this help menu' },
      { cmd: '/login', desc: 'Authenticate via OAuth 2.0' },
      { cmd: '/research <topic>', desc: 'Deep web research and synthesis' },
      { cmd: '/agent <task>', desc: 'Trigger autonomous agent swarm' },
      { cmd: '/debate <topic>', desc: 'Trigger multi-agent debate mode' },
      { cmd: '/simulate <scenario>', desc: 'Run predictive simulation engine' },
      { cmd: '/api wrap <url>', desc: 'Convert OpenAPI spec to CLI tools' },
      { cmd: '/git [commit|pr]', desc: 'AI Git Assistant (auto-commit, PRs)' },
      { cmd: '/analyze [path]', desc: 'Code Quality Analyzer & Arch Advisor' },
      { cmd: '/agents spawn <name>', desc: 'Spawn a specific subagent (e.g., debugger)' },
      { cmd: '/mcp [list|connect]', desc: 'Manage MCP tool servers' },
      { cmd: '/cost', desc: 'View live token usage and cost estimate' },
      { cmd: '/export [filename]', desc: 'Export chat history to Markdown' },
      { cmd: '!<command>', desc: 'Execute a shell command directly (Secured)' },
      { cmd: '@<agent> <task>', desc: 'Send a task directly to a subagent' },
      { cmd: '/exit', desc: 'Quit the application' }
    ];

    commands.forEach(c => {
      console.log(`  \x1b[36m${c.cmd.padEnd(25)}\x1b[0m \x1b[90m${c.desc}\x1b[0m`);
    });
    console.log();
  }
}
