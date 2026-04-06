import { state, MODES } from '../state/index.js';
import { renderSuccess, renderInfo } from '../ui/prompt.js';
import { printBox } from '../ui/output.js';

export async function debugCommand(args) {
  const subcmd = args[0];

  if (!subcmd || subcmd === 'on') {
    state.debug = true;
    state.verbose = true;
    state.setMode(MODES.DEBUG);
    console.log(renderSuccess('Debug mode enabled.'));
    return;
  }

  if (subcmd === 'off') {
    state.debug = false;
    state.verbose = false;
    state.setMode(MODES.CHAT);
    console.log(renderInfo('Debug mode disabled.'));
    return;
  }

  if (subcmd === 'status') {
    printBox('Internal State', [
      `Mode: ${state.mode}`,
      `Theme: ${state.theme}`,
      `Verbose: ${state.verbose}`,
      `Debug: ${state.debug}`,
      `Active Models: ${state.getActiveModels().map(m => m.id).join(', ')}`,
      `Plugins: ${state.plugins.filter(p => p.enabled).map(p => p.id).join(', ')}`,
    ]);
    return;
  }
}
