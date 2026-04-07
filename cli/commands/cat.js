import { readFileContent } from '../../tools/filesystem/fileSystem.js';
import { renderError } from '../ui/prompt.js';
import highlight from 'cli-highlight';
import path from 'path';

export async function catCommand(args) {
  const filePath = args[0];
  if (!filePath) {
    console.log(renderError('Usage: /cat <path>'));
    return;
  }

  try {
    const content = readFileContent(filePath);
    const ext = path.extname(filePath).slice(1) || 'txt';
    
    const highlighted = highlight.highlight(content, {
      language: ext,
      ignoreIllegals: true
    });
    
    console.log('\n' + highlighted + '\n');
  } catch (err) {
    console.log(renderError(`Failed to read file: ${err.message}`));
  }
}
