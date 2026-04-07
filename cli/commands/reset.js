import { state } from '../state/index.js';
import { renderSuccess } from '../ui/prompt.js';
import { printWelcome } from '../ui/banner.js';

export async function resetCommand(args) {
  state.conversationHistory = [];
  state.clearMemory();
  process.stdout.write('\x1Bc');
  printWelcome();
  console.log(renderSuccess('Session reset. Context and memory cleared.'));
}
