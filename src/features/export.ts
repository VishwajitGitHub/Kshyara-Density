import fs from 'fs';
import path from 'path';
import { brain } from '../core/brain.js';
import { UI } from '../ui.js';

/**
 * Exports the current chat history to a beautifully formatted Markdown file.
 */
export function exportHistoryToMarkdown(filename?: string) {
  const history = brain.getHistory();
  
  if (history.length === 0) {
    UI.warning('No chat history to export.');
    return;
  }

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const targetFile = filename ? path.resolve(process.cwd(), filename) : path.resolve(process.cwd(), `density-export-${dateStr}.md`);

  let mdContent = `# Kshyara's Density - Session Export\n\n`;
  mdContent += `*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;

  for (const msg of history) {
    const roleName = msg.role === 'user' ? '👤 **You**' : msg.role === 'assistant' ? '🤖 **Density AI**' : '⚙️ **System**';
    mdContent += `### ${roleName} \n_${msg.timestamp.toLocaleTimeString()}_\n\n`;
    mdContent += `${msg.content}\n\n---\n\n`;
  }

  try {
    fs.writeFileSync(targetFile, mdContent, 'utf8');
    UI.success(`Chat history successfully exported to: ${targetFile}`);
  } catch (err: any) {
    UI.error(`Failed to export history: ${err.message}`);
  }
}
