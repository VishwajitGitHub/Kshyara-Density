import { printWelcome } from '../ui/banner.js';

export async function clearCommand(args) {
  process.stdout.write('\x1Bc');
  printWelcome();
}
