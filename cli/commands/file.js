import { readFileContent } from '../../tools/filesystem/fileSystem.js';
import { state } from '../state/index.js';
import { renderError, renderSuccess } from '../ui/prompt.js';

export async function fileCommand(args) {
  const filePath = args[0];
  if (!filePath) {
    console.log(renderError('Usage: /file <path>'));
    return;
  }

  try {
    const content = readFileContent(filePath);
    
    // Add to conversation history as a system/context message
    state.addToConversation('system', `User attached file ${filePath}:\n\n${content}`);
    
    console.log(renderSuccess(`Attached ${filePath} (${content.length} bytes) to context.`));
  } catch (err) {
    console.log(renderError(`Failed to read file: ${err.message}`));
  }
}
