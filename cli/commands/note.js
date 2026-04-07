import { saveLongTermMemory } from '../../memory/long-term/longTermMemory.js';
import { renderSuccess, renderError } from '../ui/prompt.js';

export async function noteCommand(args) {
  const note = args.join(' ');
  if (!note) {
    console.log(renderError('Usage: /note <your note text>'));
    return;
  }

  try {
    const saved = saveLongTermMemory(note, ['manual-note']);
    console.log(renderSuccess(`Note saved to long-term memory (ID: ${saved.id})`));
  } catch (err) {
    console.log(renderError(`Failed to save note: ${err.message}`));
  }
}
