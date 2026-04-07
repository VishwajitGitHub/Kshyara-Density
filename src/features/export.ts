import fs from 'fs';
import path from 'path';
import { DensityUI } from '../ui.js';

export class MarkdownExporter {
  public exportHistory(history: any[], filename?: string) {
    const name = filename || `density-session-${Date.now()}.md`;
    const filePath = path.join(process.cwd(), name);
    
    let md = `# Density Chat Session Export\n\nGenerated on: ${new Date().toISOString()}\n\n---\n\n`;

    for (const msg of history) {
      const role = msg.role === 'user' ? '👤 User' : '🤖 Density';
      md += `### ${role}\n${msg.content}\n\n---\n\n`;
    }

    try {
      fs.writeFileSync(filePath, md, 'utf8');
      DensityUI.success(`History exported successfully to: ${filePath}`);
    } catch (err: any) {
      DensityUI.error(`Export failed: ${err.message}`);
    }
  }

  public exportReport(report: string, topic: string) {
    const safeTopic = topic.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filePath = path.join(process.cwd(), `research-${safeTopic}.md`);
    
    try {
      fs.writeFileSync(filePath, report, 'utf8');
      DensityUI.success(`Research report exported to: ${filePath}`);
    } catch (err: any) {
      DensityUI.error(`Report export failed: ${err.message}`);
    }
  }
}

export const exporter = new MarkdownExporter();
