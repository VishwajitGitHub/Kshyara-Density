import { performWebSearch } from '../../tools/web/webSearch.js';
import { createProcessingSpinner } from '../ui/spinner.js';
import { streamResponse } from '../utils/ai.js';
import { streamOutput, printBox } from '../ui/output.js';
import { renderError } from '../ui/prompt.js';
import chalk from 'chalk';

export async function searchCommand(args) {
  const query = args.join(' ');
  if (!query) {
    console.log(renderError('Usage: /search <query>'));
    return;
  }

  const spinner = createProcessingSpinner('Searching the web...');
  spinner.start();
  
  try {
    const results = await performWebSearch(query);
    spinner.stop();
    
    if (!results || results.length === 0) {
      console.log(chalk.yellow('No results found.'));
      return;
    }

    const sources = results.map((res, i) => `[${i + 1}] ${res.url} - ${res.title}`);
    printBox('Sources Cited', sources);

    const synthesisPrompt = `
You are a research assistant. The user asked: "${query}"
Here are the search results:
${JSON.stringify(results, null, 2)}

Synthesize these results into a comprehensive answer. Cite your sources using the URLs provided.
`;

    const gen = streamResponse(synthesisPrompt, { model: 'gpt-4o' });
    await streamOutput(gen);

  } catch (err) {
    spinner.stop();
    console.log(renderError(`Search failed: ${err.message}`));
  }
}
