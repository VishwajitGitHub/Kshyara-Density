import fs from 'fs';
import path from 'path';

const SOUL_FILES = ['soul.md', 'instruction.md', 'CLAUDE.md', 'GEMINI.md', '.kshyara/soul.md'];

export function getSystemInstructions(dir = process.cwd()) {
  let instructions = '';
  
  for (const file of SOUL_FILES) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        instructions += `\n\n--- Instructions from ${file} ---\n${content}\n`;
      } catch (e) {}
    }
  }
  
  return instructions;
}
