import fs from 'fs';
import path from 'path';

const COMMON_IGNORES = ['.git', 'node_modules', 'dist', 'build', '.next', 'coverage', '.cache'];

export function detectProjectContext(dir = process.cwd()) {
  const context = { type: 'unknown', dependencies: [], configFiles: [] };
  
  if (fs.existsSync(path.join(dir, 'package.json'))) {
    context.type = 'Node.js';
    context.configFiles.push('package.json');
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      context.dependencies = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
    } catch (e) {}
  } else if (fs.existsSync(path.join(dir, 'requirements.txt')) || fs.existsSync(path.join(dir, 'pyproject.toml'))) {
    context.type = 'Python';
  } else if (fs.existsSync(path.join(dir, 'Cargo.toml'))) {
    context.type = 'Rust';
  } else if (fs.existsSync(path.join(dir, 'go.mod'))) {
    context.type = 'Go';
  }
  
  return context;
}

export function getDirectoryTree(dir = process.cwd(), prefix = '', depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return '';
  
  let tree = '';
  try {
    const files = fs.readdirSync(dir);
    const filteredFiles = files.filter(f => !COMMON_IGNORES.includes(f));
    
    for (let i = 0; i < filteredFiles.length; i++) {
      const file = filteredFiles[i];
      const isLast = i === filteredFiles.length - 1;
      const fullPath = path.join(dir, file);
      
      tree += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
      
      if (fs.statSync(fullPath).isDirectory()) {
        tree += getDirectoryTree(fullPath, prefix + (isLast ? '    ' : '│   '), depth + 1, maxDepth);
      }
    }
  } catch (e) {
    tree += `${prefix}└── [Error reading directory]\n`;
  }
  return tree;
}
