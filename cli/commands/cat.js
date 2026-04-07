import fs from 'fs';
import path from 'path';
import { renderError, renderDivider } from '../ui/prompt.js';
import chalk from 'chalk';

export async function catCommand(args) {
  if (args.length === 0) {
    console.log(renderError('Usage: /cat <filepath>'));
    return;
  }

  const filePath = path.resolve(process.cwd(), args[0]);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(renderError(`File not found: ${filePath}`));
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    console.log();
    console.log(renderDivider(`File: ${args[0]}`));
    
    // Basic syntax highlighting simulation
    console.log(chalk.cyan(content));
    
    console.log(renderDivider('EOF'));
    console.log();
  } catch (err) {
    console.log(renderError(`Failed to read file: ${err.message}`));
  }
}
