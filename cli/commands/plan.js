import { plannerAgent } from '../../agents/planner/plannerAgent.js';
import { streamOutput } from '../ui/output.js';
import { renderDivider, renderError } from '../ui/prompt.js';
import { createThinkingSpinner } from '../ui/spinner.js';

export async function planCommand(args) {
  const prompt = args.join(' ');
  if (!prompt) {
    console.log(renderError('Usage: /plan <task>'));
    return;
  }

  console.log();
  console.log(renderDivider('Planner Agent'));
  
  const spinner = createThinkingSpinner();
  spinner.start();
  await new Promise(r => setTimeout(r, 200));
  spinner.stop();

  const gen = plannerAgent.streamExecute(prompt);
  await streamOutput(gen);
}
