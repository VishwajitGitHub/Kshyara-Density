import { state } from '../state/index.js';
import { renderSectionHeader, renderAIPrefix, renderUserBubble } from '../ui/prompt.js';
import chalk from 'chalk';

export async function historyCommand(args) {
  const limit = parseInt(args[0]) || 20;
  const history = state.conversationHistory.slice(-limit);
  
  console.log();
  console.log(renderSectionHeader(`Conversation History (Last ${history.length})`));
  console.log();

  if (history.length === 0) {
    console.log(chalk.hex(state.getThemeColors().mutedDim)('  No history yet.'));
    return;
  }

  history.forEach(msg => {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const preview = msg.content.length > 60 ? msg.content.substring(0, 60) + '...' : msg.content;
    
    if (msg.role === 'user') {
      console.log(`  [${time}] ` + renderUserBubble(preview));
    } else {
      console.log(`  [${time}] ` + renderAIPrefix(msg.model || 'AI', '▸') + chalk.hex(state.getThemeColors().text)(preview));
    }
  });
  console.log();
}
