import readline from 'readline';
import { updateConfig } from '../config/index.js';
import { renderSuccess, renderInfo } from '../ui/prompt.js';

export async function loginCommand(args) {
  console.log(renderInfo('Starting login process...'));
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Enter Username: ', (name) => {
      rl.question('Enter API Key: ', (apiKey) => {
        updateConfig({ user: { name, apiKey } });
        console.log(renderSuccess('Credentials saved to ~/.kshyara/config.json'));
        rl.close();
        resolve();
      });
    });
  });
}
