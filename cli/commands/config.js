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
      `Primary Model: ${config.models?.primary || 'gpt-4o'}`,
      `Fallback Model: ${config.models?.fallback || 'claude-3-7'}`,
      `User Name: ${config.user?.name || 'Not set'}`,
    ]);
    return;
  }

  if (subcmd === 'get') {
    const key = args[1];
    if (!key) return console.log(renderError('Usage: /config get <key>'));
    
    const keys = key.split('.');
    let val = config;
    for (const k of keys) {
      if (val === undefined) break;
      val = val[k];
    }
    console.log(renderSuccess(`${key} = ${val}`));
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

    const keys = key.split('.');
    if (keys.length === 1) {
      updateConfig({ [key]: parsedVal });
    } else if (keys.length === 2) {
      const topKey = keys[0];
      const subKey = keys[1];
      const currentObj = config[topKey] || {};
      updateConfig({ [topKey]: { ...currentObj, [subKey]: parsedVal } });
    } else {
      return console.log(renderError('Only 1 level of nesting is supported for now.'));
    }

    console.log(renderSuccess(`Set ${key} to ${val}`));
    return;
  }

  console.log(renderError(`Unknown config subcommand: ${subcmd}`));
}
