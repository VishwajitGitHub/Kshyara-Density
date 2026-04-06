import { state } from '../state/index.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const PLUGIN_DIR = path.join(os.homedir(), '.kshyara', 'plugins');

const BUILT_IN_PLUGINS = [
  { id: 'code-formatter',    type: 'output-transformer', enabled: true  },
  { id: 'syntax-highlighter',type: 'output-transformer', enabled: true  },
  { id: 'markdown-renderer', type: 'output-transformer', enabled: false },
  { id: 'history-sync',      type: 'storage',            enabled: false },
];

export const pluginManager = {
  plugins: [],
  transformers: [],

  async init(commandRegistry) {
    state.plugins = [...BUILT_IN_PLUGINS];

    if (!fs.existsSync(PLUGIN_DIR)) {
      fs.mkdirSync(PLUGIN_DIR, { recursive: true });
      
      // Create a sample plugin
      const samplePlugin = `// Sample Kshyara Plugin
export const commands = {
  '/hello': {
    handler: async (args) => { console.log('Hello from sample plugin!'); },
    description: 'A sample plugin command',
    usage: '/hello'
  }
};

export async function onInit() {
  // Initialization logic here
}
`;
      fs.writeFileSync(path.join(PLUGIN_DIR, 'sample.js'), samplePlugin);
    }

    const files = fs.readdirSync(PLUGIN_DIR).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      try {
        const pluginPath = path.join(PLUGIN_DIR, file);
        const pluginUrl = `file://${pluginPath}`;
        const plugin = await import(pluginUrl);
        
        this.plugins.push({ name: file, ...plugin });

        // Register commands dynamically
        if (plugin.commands && commandRegistry) {
          for (const [cmdName, cmdDef] of Object.entries(plugin.commands)) {
            commandRegistry[cmdName] = cmdDef;
          }
        }

        // Register transformers
        if (plugin.transformOutput) {
          this.transformers.push(plugin.transformOutput);
        }

        if (plugin.onInit) {
          await plugin.onInit();
        }
      } catch (err) {
        console.error(chalk.red(`Failed to load plugin ${file}: ${err.message}`));
      }
    }
  }
};

export function loadPlugins() {
  // Backwards compatibility stub
  state.plugins = [...BUILT_IN_PLUGINS];
}

export function togglePlugin(id) {
  const plugin = state.plugins.find(p => p.id === id);
  if (plugin) {
    plugin.enabled = !plugin.enabled;
    return plugin.enabled;
  }
  return null;
}

export async function runOutputTransformers(text) {
  let result = text;
  for (const transformer of pluginManager.transformers) {
    result = await transformer(result);
  }
  return result;
}
