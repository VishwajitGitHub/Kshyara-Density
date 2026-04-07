import { state } from '../state/index.js';
import { renderSuccess } from '../ui/prompt.js';

export async function resetCommand(args) {
  state.clearConversation();
  state.clearMemory();
  console.log(renderSuccess('Session completely reset (Context and Memory cleared).'));
}
