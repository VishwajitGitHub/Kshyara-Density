import { toolRegistry } from './registry.js';
import { ReadFileTool, WriteFileTool } from './filesystem.js';
import { ShellTool } from './system.js';

export function initializeTools() {
  toolRegistry.register(new ReadFileTool());
  toolRegistry.register(new WriteFileTool());
  toolRegistry.register(new ShellTool());
  
  // Base 100 tools will be added here in batches
}
