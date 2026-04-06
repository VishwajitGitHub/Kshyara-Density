import fs from 'fs';
import path from 'path';
import os from 'os';
import { state } from '../state/index.js';
import { renderSuccess, renderError } from '../ui/prompt.js';

export async function exportCommand(args) {
  const format = args[0] || 'markdown';
  const exportDir = path.join(os.homedir(), '.kshyara', 'exports');
  
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filename = `session_${state.session.id}_${Date.now()}.${format === 'json' ? 'json' : 'md'}`;
  const filepath = path.join(exportDir, filename);

  try {
    if (format === 'json') {
      fs.writeFileSync(filepath, JSON.stringify(state.conversationHistory, null, 2));
    } else {
      let md = `# KSHYARA Session Export\n\n**Session ID:** ${state.session.id}\n**Date:** ${new Date().toLocaleString()}\n\n---\n\n`;
      state.conversationHistory.forEach(msg => {
        md += `### ${msg.role.toUpperCase()} ${msg.model ? `(${msg.model})` : ''}\n${msg.content}\n\n`;
      });
      fs.writeFileSync(filepath, md);
    }
    console.log(renderSuccess(`Exported session to ${filepath}`));
  } catch (e) {
    console.log(renderError(`Failed to export: ${e.message}`));
  }
}
