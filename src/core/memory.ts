import fs from 'fs';
import path from 'path';
import { UI } from '../ui.js';

/**
 * Mistake Memory
 * Implements: Learns your past bugs and avoids repeating
 */
export class MemoryEngine {
  private memoryPath = path.join(process.cwd(), '.kshyara', 'mistakes.json');
  private mistakes: string[] = [];

  constructor() {
    this.loadMemory();
  }

  private loadMemory() {
    if (fs.existsSync(this.memoryPath)) {
      try {
        this.mistakes = JSON.parse(fs.readFileSync(this.memoryPath, 'utf-8'));
      } catch (e) {
        this.mistakes = [];
      }
    } else {
      const dir = path.dirname(this.memoryPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      this.saveMemory();
    }
  }

  private saveMemory() {
    fs.writeFileSync(this.memoryPath, JSON.stringify(this.mistakes, null, 2));
  }

  public recordMistake(mistake: string) {
    this.mistakes.push(mistake);
    this.saveMemory();
    UI.info(`🧠 Logged mistake to long-term memory to avoid repeating.`);
  }

  public getMistakesContext(): string {
    if (this.mistakes.length === 0) return '';
    return `\n[PAST MISTAKES TO AVOID]\n- ${this.mistakes.join('\n- ')}\n`;
  }
}

export const memory = new MemoryEngine();
