import fs from 'fs';
import path from 'path';

export interface MemoryEntry {
  id: string;
  text: string;
  tags: string[];
}

export class MemoryStore {
  private entries: MemoryEntry[] = [];
  private dbPath = path.join(process.cwd(), '.kshyara', 'knowledge.json');

  constructor() {
    this.load();
  }

  public store(text: string, tags: string[] = []) {
    this.entries.push({
      id: Math.random().toString(36).substring(7),
      text,
      tags
    });
    this.save();
  }

  public query(keyword: string): MemoryEntry[] {
    return this.entries.filter(e => 
      e.text.toLowerCase().includes(keyword.toLowerCase()) || 
      e.tags.some(t => t.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  public getAll(): MemoryEntry[] {
    return this.entries;
  }

  private load() {
    if (fs.existsSync(this.dbPath)) {
      try {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.entries = JSON.parse(data);
      } catch (e) {}
    }
  }

  private save() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.dbPath, JSON.stringify(this.entries, null, 2));
  }
}

export const memoryStore = new MemoryStore();
