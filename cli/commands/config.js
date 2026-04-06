import { loadConfig, updateConfig } from '../config/index.js';
import { printKeyValue, printBox } from '../ui/output.js';
import { renderError, renderSuccess } from '../ui/prompt.js';

export async function configCommand(args) {
  const config = loadConfig();
  const subcmd = args[0];

  if (!subcmd || subcmd === 'list') {
    printBox('Configuration', [
      `Theme: ${config.theme}`,
      `Verbose: ${config.verbose}`,
      `Default Mode: ${config.defaultMode}`,
      `Primary Model: ${config.models.primary}`,
      `Fallback Model: ${config.models.fallback}`,
      `User Name: ${config.user.name || 'Not set'}`,
    ]);
    return;
  }

  if (subcmd === 'get') {
    const key = args[1];
    if (!key) return console.log(renderError('Usage: /config get <key>'));
    // Simple top-level get for now
    console.log(renderSuccess(`${key} = ${config[key]}`));
    return;
  }

  if (subcmd === 'set') {
    const key = args[1];
    const val = args[2];
    if (!key || !val) return console.log(renderError('Usage: /config set <key> <value>'));
    
    let parsedVal = val;
    if (val === 'true') parsedVal = true;
    if (val === 'false') parsedVal = false;
    if (!isNaN(Number(val))) parsedVal = Number(val);

    updateConfig({ [key]: parsedVal });
    console.log(renderSuccess(`Set ${key} to ${val}`));
    return;
  }

  console.log(renderError(`Unknown config subcommand: ${subcmd}`));
}
