import { state } from '../state/index.js';
import { renderError, renderSuccess, renderSectionHeader } from '../ui/prompt.js';
import chalk from 'chalk';

export async function contextCommand(args) {
  const subcmd = args[0] || 'view';

  if (subcmd === 'view') {
    const ctx = state.conversationHistory;
    console.log();
    console.log(renderSectionHeader(`Current Context (${ctx.length} messages)`));
    console.log();
    
    if (ctx.length === 0) {
      console.log(chalk.hex(state.getThemeColors().mutedDim)('  Context is empty.'));
      return;
    }

    let totalChars = 0;
    ctx.forEach((msg, i) => {
      totalChars += msg.content.length;
      const preview = msg.content.length > 50 ? msg.content.substring(0, 50).replace(/\n/g, ' ') + '...' : msg.content.replace(/\n/g, ' ');
      console.log(`  ${chalk.bold(i + 1)}. [${msg.role.toUpperCase()}] ${preview}`);
    });
    
    console.log();
    console.log(chalk.hex(state.getThemeColors().mutedDim)(`  Total Size: ~${Math.round(totalChars / 4)} tokens`));
    console.log();
    return;
  }

  if (subcmd === 'clear') {
    state.conversationHistory = [];
    console.log(renderSuccess('Conversation context cleared.'));
    return;
  }

  console.log(renderError(`Unknown context subcommand: ${subcmd}`));
}
