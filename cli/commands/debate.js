import { runDebate } from '../core/debate.js';
import { renderError } from '../ui/prompt.js';

export async function debateCommand(args) {
  const prompt = args.join(' ');
  if (!prompt) {
    console.log(renderError('Usage: /debate <topic>'));
    return;
  }
  await runDebate(prompt);
}
