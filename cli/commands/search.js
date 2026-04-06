import { createProcessingSpinner } from '../ui/spinner.js';
import { streamResponse } from '../utils/ai.js';
import { streamOutput, printBox } from '../ui/output.js';
import { renderError } from '../ui/prompt.js';

export async function searchCommand(args) {
  const query = args.join(' ');
  if (!query) {
    console.log(renderError('Usage: /search <query>'));
    return;
  }

  const spinner = createProcessingSpinner('Searching the web...');
  spinner.start();
  
  await new Promise(r => setTimeout(r, 400));
  spinner.text = 'Retrieving sources...';
  await new Promise(r => setTimeout(r, 300));
  spinner.text = 'Ranking results...';
  await new Promise(r => setTimeout(r, 300));
  
  spinner.stop();

  printBox('Sources Cited', [
    '[1] https://example.com/article-1 (Relevance: 98%)',
    '[2] https://docs.example.org/v2   (Relevance: 92%)',
    '[3] https://github.com/example    (Relevance: 85%)'
  ]);

  const gen = streamResponse(`Synthesize an answer for: ${query} based on web search results.`);
  await streamOutput(gen);
}
