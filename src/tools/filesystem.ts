import fs from 'fs';
import path from 'path';
import { BaseTool, ToolMetadata } from './registry.js';

export class ReadFileTool extends BaseTool {
  metadata: ToolMetadata = {
    name: 'read_file',
    description: 'Reads the contents of a file at the given path.',
    category: 'filesystem',
    parameters: {
      path: { type: 'string', description: 'Absolute or relative path to the file.' }
    }
  };

  async execute({ path: filePath }: { path: string }): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  }
}

export class WriteFileTool extends BaseTool {
  metadata: ToolMetadata = {
    name: 'write_file',
    description: 'Writes content to a file at the given path.',
    category: 'filesystem',
    parameters: {
      path: { type: 'string', description: 'Path where the file will be saved.' },
      content: { type: 'string', description: 'The content to write.' }
    }
  };

  async execute({ path: filePath, content }: { path: string; content: string }): Promise<string> {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    return `Successfully wrote to ${filePath}`;
  }
}
