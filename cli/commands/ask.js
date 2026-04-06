import { streamResponse } from '../utils/ai.js';
import { streamOutput } from '../ui/output.js';
import { createThinkingSpinner } from '../ui/spinner.js';
import { renderError } from '../ui/prompt.js';

export async function askCommand(args) {
  const prompt = args.join(' ');
  if (!prompt) {
    console.log(renderError('Usage: /ask <prompt>'));
    return;
  }

  const spinner = createThinkingSpinner();
  spinner.start();
  await new Promise(r => setTimeout(r, 160));
  spinner.stop();

  try {
    const gen = streamResponse(prompt);
    await streamOutput(gen);
  } catch (err) {
    console.log(renderError(`AI error: ${err.message}`));
  }
}
