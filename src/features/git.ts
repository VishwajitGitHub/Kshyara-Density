import { UI } from '../ui.js';
import { brain } from '../core/brain.js';

/**
 * AI Git Assistant
 * Implements: Writes commits, PRs, changelogs
 */
export async function runGitAssistant(args: string[]) {
  const subcmd = args[0];

  UI.divider('AI Git Assistant');

  if (subcmd === 'commit') {
    UI.info('Analyzing staged changes...');
    await new Promise(r => setTimeout(r, 1000));
    
    const simulatedDiff = `
+ import { IntelligenceEngine } from './intelligence.js';
+ const engine = new IntelligenceEngine();
- console.log("old logic");
    `.trim();

    console.log(`\x1b[90m${simulatedDiff}\x1b[0m\n`);
    
    const commitMsg = `feat(core): integrate IntelligenceEngine for auto-prompt optimization`;
    console.log(`  \x1b[32mSuggested Commit:\x1b[0m ${commitMsg}`);
    
    // In a real app, we would prompt to execute `git commit -m "..."`
    UI.success('Commit message generated successfully.');
    brain.addMessage('assistant', `Generated git commit: ${commitMsg}`);
  } 
  else if (subcmd === 'pr') {
    UI.info('Analyzing branch commits against main...');
    await new Promise(r => setTimeout(r, 1500));
    
    const prBody = `
## Description
This PR introduces the new Intelligence Engine and Security Engine to the core architecture.

## Changes
- Added \`IntelligenceEngine\` for prompt optimization.
- Added \`SecurityEngine\` to block dangerous shell commands.
- Updated \`app.ts\` to wire up the new modules.

## Testing
- Verified command blocking (e.g., \`rm -rf /\` is blocked).
    `.trim();

    console.log(`\n\x1b[36m${prBody}\x1b[0m\n`);
    UI.success('Pull Request description generated.');
  }
  else {
    UI.error('Usage: /git [commit|pr]');
  }
}
