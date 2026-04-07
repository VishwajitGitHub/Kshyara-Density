import fs from 'fs';
import path from 'path';
import os from 'os';

const MEMORY_DIR = path.join(os.homedir(), '.kshyara', 'memory');
const LONG_TERM_FILE = path.join(MEMORY_DIR, 'long-term.json');

export function initMemorySystem() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
  if (!fs.existsSync(LONG_TERM_FILE)) {
    fs.writeFileSync(LONG_TERM_FILE, JSON.stringify([]), 'utf8');
  }
}

export function saveLongTermMemory(note, tags = []) {
  initMemorySystem();
  const memories = JSON.parse(fs.readFileSync(LONG_TERM_FILE, 'utf8'));
  
  const newMemory = {
    id: Math.random().toString(36).substring(2, 10),
    timestamp: new Date().toISOString(),
    content: note,
    tags
  };
  
  memories.push(newMemory);
  fs.writeFileSync(LONG_TERM_FILE, JSON.stringify(memories, null, 2), 'utf8');
  return newMemory;
}

export function searchLongTermMemory(query) {
  initMemorySystem();
  const memories = JSON.parse(fs.readFileSync(LONG_TERM_FILE, 'utf8'));
  
  const q = query.toLowerCase();
  // Basic keyword search (simulating vector search for now)
  return memories.filter(m => 
    m.content.toLowerCase().includes(q) || 
    m.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function getAllLongTermMemories() {
  initMemorySystem();
  return JSON.parse(fs.readFileSync(LONG_TERM_FILE, 'utf8'));
}
