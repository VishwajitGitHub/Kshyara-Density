import { state, THEMES } from '../state/index.js';
import { updateConfig } from '../config/index.js';
import { printTable } from '../ui/output.js';
import { renderError, renderSuccess } from '../ui/prompt.js';
import gradient from 'gradient-string';

export async function themeCommand(args) {
  const themeName = args[0];

  if (!themeName) {
    const headers = ['Theme Name', 'Preview'];
    const rows = Object.keys(THEMES).map(name => {
      const t = THEMES[name];
      const grad = gradient(t.gradient);
      return [name, grad('████████████████████')];
    });
    console.log();
    printTable(headers, rows);
    return;
  }

  if (THEMES[themeName]) {
    state.setTheme(themeName);
    updateConfig({ theme: themeName });
    console.log(renderSuccess(`Theme changed to ${themeName}`));
  } else {
    console.log(renderError(`Theme not found: ${themeName}`));
  }
}
