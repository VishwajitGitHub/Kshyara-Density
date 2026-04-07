import { execSync } from 'child_process';
import { BaseTool, ToolMetadata } from './registry.js';

export class ShellTool extends BaseTool {
  metadata: ToolMetadata = {
    name: 'shell',
    description: 'Executes a command in the terminal.',
    category: 'system',
    parameters: {
      command: { type: 'string', description: 'The command to run.' }
    }
  };

  async execute({ command }: { command: string }): Promise<string> {
    try {
      const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
      return output || '(No output)';
    } catch (error: any) {
      throw new Error(`Command execution failed: ${error.stderr || error.message}`);
    }
  }
}
