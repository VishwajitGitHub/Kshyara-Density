import { streamResponse } from '../utils/ai.js';
import { streamOutput } from '../ui/output.js';
import { renderDivider } from '../ui/prompt.js';
import { createThinkingSpinner } from '../ui/spinner.js';

export async function refineCommand(args) {
  const prompt = args.join(' ') || "Improve the previous response";
  
  console.log();
  console.log(renderDivider('Refinement Pass 1'));
  
  let spinner = createThinkingSpinner();
  spinner.start();
  await new Promise(r => setTimeout(r, 200));
  spinner.stop();
  
  let gen = streamResponse(prompt);
  await streamOutput(gen);
  
  console.log(renderDivider('Refinement Pass 2 (Critique & Improve)'));
  
  spinner = createThinkingSpinner();
  spinner.start();
  await new Promise(r => setTimeout(r, 300));
  spinner.stop();
  
  gen = streamResponse("Critique your previous answer and provide a strictly better version.");
  await streamOutput(gen);
}
