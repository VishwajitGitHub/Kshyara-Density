import readline from 'readline';
import { updateConfig, loadConfig } from '../config/index.js';
import { renderSuccess, renderInfo, renderDivider, renderError } from '../ui/prompt.js';
import { state } from '../state/index.js';
import chalk from 'chalk';

export async function loginCommand(args) {
  console.log();
  console.log(renderDivider('API Key Configuration'));
  
  const config = loadConfig();
  const currentKeys = config.keys || {};
  
  // Get unique providers from ALL_MODELS
  const providers = [...new Set(state.activeModels.map(m => m.provider))];
  
  console.log(chalk.cyan('Available Providers:'));
  providers.forEach((p, index) => {
    const isConfigured = currentKeys[`${p.toLowerCase()}ApiKey`] ? chalk.green(' [Configured]') : chalk.gray(' [Not Configured]');
    console.log(`  ${chalk.bold(index + 1)}. ${p}${isConfigured}`);
  });
  console.log(`  ${chalk.bold(0)}. Cancel`);
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.cyan('Select a provider (0-' + providers.length + '): '), (choice) => {
      const idx = parseInt(choice.trim(), 10);
      
      if (isNaN(idx) || idx < 0 || idx > providers.length) {
        console.log(renderError('Invalid selection.'));
        rl.close();
        resolve();
        return;
      }

      if (idx === 0) {
        console.log(chalk.gray('Configuration cancelled.'));
        rl.close();
        resolve();
        return;
      }

      const selectedProvider = providers[idx - 1];
      const keyName = `${selectedProvider.toLowerCase()}ApiKey`;

      rl.question(chalk.cyan(`Enter your ${selectedProvider} API Key: `), (apiKey) => {
        const trimmedKey = apiKey.trim();
        if (trimmedKey) {
          updateConfig({ keys: { ...currentKeys, [keyName]: trimmedKey } });
          console.log(renderSuccess(`Successfully saved ${selectedProvider} API Key!`));
        } else {
          console.log(chalk.yellow('No key entered. Configuration unchanged.'));
        }
        rl.close();
        resolve();
      });
    });
  });
}
