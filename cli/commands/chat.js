import { state, MODES } from '../state/index.js';
import { printModeChange } from '../ui/banner.js';

export async function chatCommand(args) {
  if (state.mode !== MODES.CHAT) {
    state.setMode(MODES.CHAT);
    printModeChange(MODES.CHAT);
  }
}
