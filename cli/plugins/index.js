import { state } from '../state/index.js';

const BUILT_IN_PLUGINS = [
  { id: 'code-formatter',    type: 'output-transformer', enabled: true  },
  { id: 'syntax-highlighter',type: 'output-transformer', enabled: true  },
  { id: 'markdown-renderer', type: 'output-transformer', enabled: false },
  { id: 'history-sync',      type: 'storage',            enabled: false },
];

export function loadPlugins() {
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
  // In a real implementation, this would pipe the text through active transformer plugins
  return result;
}
