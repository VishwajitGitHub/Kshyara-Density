import fs from 'fs';
import path from 'path';
import { Renderer } from '../ui/renderer.js';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export class Brain {
  private history: Message[] = [];
  private maxHistory = 50;
  private memoryPath = path.join(process.cwd(), '.kshyara', 'memory.json');

  constructor() {
    this.loadMemory();
  }

  public addMessage(role: 'user' | 'assistant' | 'system', content: string) {
    this.history.push({ role, content, timestamp: Date.now() });
    
    if (this.history.length > this.maxHistory) {
      this.compact();
    }
    
    this.saveMemory();
  }

  public getHistory(): Message[] {
    return this.history;
  }

  private compact() {
    Renderer.warning('Context window full. Compacting history...');
    // Keep system messages and last 10 messages
    const system = this.history.filter(m => m.role === 'system');
    const recent = this.history.slice(-10);
    this.history = [...system, ...recent];
  }

  private loadMemory() {
    if (fs.existsSync(this.memoryPath)) {
      try {
        const data = fs.readFileSync(this.memoryPath, 'utf-8');
        this.history = JSON.parse(data);
      } catch (e) {
        Renderer.error('Failed to load memory store.');
      }
    }
  }

  private saveMemory() {
    const dir = path.dirname(this.memoryPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.memoryPath, JSON.stringify(this.history, null, 2));
  }
}

export const brain = new Brain();
