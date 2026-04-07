import { state } from '../state/index.js';
import { renderError, renderSuccess, renderDivider } from '../ui/prompt.js';
import chalk from 'chalk';

export async function contextCommand(args) {
  const subcmd = args[0] || 'view';

  if (subcmd === 'clear') {
    state.clearConversation();
    console.log(renderSuccess('Conversation context cleared.'));
    return;
  }

  if (subcmd === 'view') {
    console.log();
    console.log(renderDivider('Conversation Context'));
    console.log(chalk.gray(`  Total Messages: ${state.conversationHistory.length}`));
    
    let userMsgs = 0;
    let aiMsgs = 0;
    let sysMsgs = 0;
    
    state.conversationHistory.forEach(m => {
      if (m.role === 'user') userMsgs++;
      else if (m.role === 'assistant') aiMsgs++;
      else sysMsgs++;
    });

    console.log(chalk.cyan(`  User: ${userMsgs} | AI: ${aiMsgs} | System: ${sysMsgs}`));
    console.log();
    
    if (state.conversationHistory.length > 0) {
      console.log(chalk.gray('  Recent messages:'));
      const recent = state.conversationHistory.slice(-3);
      recent.forEach(m => {
        const preview = m.content.length > 50 ? m.content.substring(0, 50) + '...' : m.content;
        console.log(`  [${m.role}] ${preview.replace(/\n/g, ' ')}`);
      });
    }
    console.log();
    return;
  }

  console.log(renderError(`Unknown subcommand: ${subcmd}. Usage: /context [view|clear]`));
}
