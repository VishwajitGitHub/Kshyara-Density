import readline from 'readline';
import chalk from 'chalk';
import { loadConfig, updateConfig } from '../../cli/config/index.js';

export async function ensureApiKey(providerName) {
  const config = loadConfig();
  const keyName = `${providerName.toLowerCase()}ApiKey`;

  // If key exists in config, return it immediately
  if (config.keys && config.keys[keyName]) {
    return config.keys[keyName];
  }

  // Otherwise, dynamically prompt the user
  console.log();
  console.log(chalk.yellow(`🔑 API Key required for ${chalk.bold(providerName)}.`));
  console.log(chalk.gray(`This is a one-time setup. The key will be saved locally.`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.cyan(`Enter your ${providerName} API Key: `), (key) => {
      rl.close();
      const trimmedKey = key.trim();
      
      // Save to config
      const currentKeys = config.keys || {};
      updateConfig({ keys: { ...currentKeys, [keyName]: trimmedKey } });
      
      console.log(chalk.green(`✔ Key saved successfully. Resuming request...\n`));
      resolve(trimmedKey);
    });
  });
}
