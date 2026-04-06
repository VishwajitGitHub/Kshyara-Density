import { criticAgent } from '../../agents/critic/criticAgent.js';
import { streamOutput } from '../ui/output.js';
import { renderDivider, renderError } from '../ui/prompt.js';
import { createThinkingSpinner } from '../ui/spinner.js';
import { state } from '../state/index.js';

export async function criticCommand(args) {
  const prompt = args.join(' ');
  
  // If no prompt provided, critique the last assistant message
  let targetContent = prompt;
  if (!targetContent) {
    const lastAssistantMsg = [...state.conversationHistory].reverse().find(m => m.role === 'assistant');
    if (lastAssistantMsg) {
      targetContent = lastAssistantMsg.content;
    } else {
      console.log(renderError('Usage: /critic <text> (or run without args to critique last response)'));
      return;
    }
  }

  console.log();
  console.log(renderDivider('Critic Agent'));
  
  const spinner = createThinkingSpinner();
  spinner.start();
  await new Promise(r => setTimeout(r, 200));
  spinner.stop();

  const gen = criticAgent.streamExecute(`Please critique the following:\n\n${targetContent}`);
  await streamOutput(gen);
}
