import { runCombiner } from '../core/combiner.js';
import { renderError } from '../ui/prompt.js';

export async function combineCommand(args) {
  const prompt = args.join(' ');
  if (!prompt) {
    console.log(renderError('Usage: /combine <prompt>'));
    return;
  }
  await runCombiner(prompt);
}
