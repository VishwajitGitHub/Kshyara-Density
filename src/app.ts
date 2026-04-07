import readline from 'readline';
import { DensityUI } from './ui.js';
import { brain } from './core/brain.js';
import { router } from './core/router.js';
import { intelligence } from './core/intelligence.js';
import { security } from './core/security.js';
import { personality } from './core/personality.js';
import { memory } from './core/memory.js';
import { researcher } from './features/researcher.js';
import { autonomousSwarm } from './features/agent.js';
import { exporter } from './features/export.js';
import { simulator } from './features/simulator.js';

export class DensityApp {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: DensityUI.getPrompt()
    });
  }

  public async initialize() {
    DensityUI.banner();
    DensityUI.info('Initializing Density Neural Core...');
    
    // Inject personality and memory context
    brain.addMessage('system', personality.getSystemPrompt());
    const mistakes = memory.getMistakesContext();
    if (mistakes) brain.addMessage('system', mistakes);
    
    DensityUI.success('System Ready.');
    this.setupEventHandlers();
    this.rl.prompt();
  }

  private setupEventHandlers() {
    this.rl.on('line', async (line) => {
      const input = line.trim();
      if (input) {
        // Security check
        if (security.isCommandSafe(input)) {
          await this.handleInput(input);
        }
      }
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\n');
      DensityUI.info("Shutting down Kshyara's Density. Goodbye!");
      process.exit(0);
    });
  }

  private async handleInput(input: string) {
    if (input.startsWith('/')) {
      const [cmd, ...args] = input.split(' ');
      return this.handleCommand(cmd.toLowerCase(), args);
    }

    // Adjust mood based on input
    personality.adjustMood(input);
    
    // Auto-optimize prompt
    const optimizedInput = intelligence.optimizePrompt(input);
    
    brain.addMessage('user', optimizedInput);
    await this.generateResponse(optimizedInput);
  }

  private async handleCommand(cmd: string, args: string[]) {
    try {
      switch (cmd) {
        case '/help':
          this.showHelp();
          break;
        case '/research':
          await researcher.research(args.join(' '));
          break;
        case '/agent':
          await autonomousSwarm.executeTask(args.join(' '));
          break;
        case '/simulate':
          await simulator.runSimulation(args.join(' '));
          break;
        case '/export':
          exporter.exportHistory(brain.getHistory(), args[0]);
          break;
        case '/exit':
        case '/quit':
          this.rl.close();
          break;
        default:
          DensityUI.error(`Unknown command: ${cmd}. Type /help for assistance.`);
      }
    } catch (err: any) {
      DensityUI.error(`Command failed: ${err.message}`);
    }
  }

  private async generateResponse(input: string) {
    const model = router.route(input);
    DensityUI.statusBar('Thinking...', model.name);
    
    await new Promise(r => setTimeout(r, 1000));
    
    const confidence = intelligence.calculateConfidence();
    const moodPrefix = personality.getMoodPrefix();
    const response = `${moodPrefix} I've analyzed your request using **${model.name}**. For complex tasks, try using \`/research\` for deep web analysis or \`/agent\` for autonomous execution. (Confidence: ${confidence}%)`;
    
    brain.addMessage('assistant', response);
    DensityUI.box(response, 'DENSITY RESPONSE');

    const nextAction = intelligence.predictNextAction(input);
    if (nextAction) {
      DensityUI.info(`Recommended next step: \x1b[36m${nextAction}\x1b[0m`);
    }
  }

  private showHelp() {
    DensityUI.divider('Density Commands');
    const commands = [
      { cmd: '/research <topic>', desc: 'Deep autonomous web research & synthesis' },
      { cmd: '/agent <task>', desc: 'Trigger self-healing multi-agent swarm' },
      { cmd: '/simulate <scen>', desc: 'Run predictive scaling & cost simulations' },
      { cmd: '/export [name]', desc: 'Export session history to Markdown' },
      { cmd: '/memory [save|query]', desc: 'Manage long-term knowledge store' },
      { cmd: '/status', desc: 'View system health & model routing stats' },
      { cmd: '/help', desc: 'Show this advanced command menu' },
      { cmd: '/exit', desc: 'Securely terminate the session' }
    ];

    commands.forEach(c => {
      console.log(`  \x1b[36m${c.cmd.padEnd(25)}\x1b[0m \x1b[90m${c.desc}\x1b[0m`);
    });
    console.log();
  }
}
