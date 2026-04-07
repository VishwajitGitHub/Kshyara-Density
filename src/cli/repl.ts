import readline from 'readline';
import { Renderer } from '../ui/renderer.js';
import { CorePipeline } from '../core/pipeline.js';

export class REPL {
  private rl: readline.Interface;
  private pipeline: CorePipeline;

  constructor() {
    this.pipeline = new CorePipeline();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: Renderer.getPrompt()
    });
  }

  public async start() {
    Renderer.banner();
    Renderer.info('Initializing Kshyara Core Pipeline...');
    Renderer.success('Phase 1 Core Online.');
    
    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const input = line.trim();
      if (input) {
        await this.pipeline.execute(input);
      }
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      Renderer.info('Shutting down Kshyara. Goodbye!');
      process.exit(0);
    });
  }
}
