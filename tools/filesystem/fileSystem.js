import fs from 'fs';
import path from 'path';

export function readFileContent(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }
  const stats = fs.statSync(absolutePath);
  if (stats.isDirectory()) {
    throw new Error(`Path is a directory, not a file: ${absolutePath}`);
  }
  if (stats.size > 1024 * 1024) { // 1MB limit for now
    throw new Error(`File is too large (>1MB): ${absolutePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf-8');
}

export function writeToFile(filePath, content) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolutePath, content, 'utf-8');
  return absolutePath;
}
