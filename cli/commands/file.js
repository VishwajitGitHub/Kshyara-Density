import fs from 'fs';
import path from 'path';
import { renderError, renderSuccess } from '../ui/prompt.js';
import { state } from '../state/index.js';

export async function fileCommand(args) {
  if (args.length === 0) {
    console.log(renderError('Usage: /file <filepath>'));
    return;
  }

  const filePath = path.resolve(process.cwd(), args[0]);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(renderError(`File not found: ${filePath}`));
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    state.addToConversation('system', `File attached (${args[0]}):\n\`\`\`\n${content}\n\`\`\``);
    console.log(renderSuccess(`Attached ${args[0]} to conversation context (${content.length} characters).`));
  } catch (err) {
    console.log(renderError(`Failed to read file: ${err.message}`));
  }
}
