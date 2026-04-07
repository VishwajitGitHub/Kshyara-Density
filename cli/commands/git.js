import { runGitCommand, getStagedDiff } from '../../tools/git/gitManager.js';
import { streamResponse } from '../utils/ai.js';
import { streamOutput } from '../ui/output.js';
import { renderError, renderDivider, renderInfo, renderSuccess } from '../ui/prompt.js';
import { state } from '../state/index.js';
import chalk from 'chalk';

export async function gitCommand(args) {
  if (args.length === 0) {
    console.log(renderError('Usage: /git <command> [args]'));
    console.log(chalk.gray('  Tip: Use /git commit auto to generate an AI commit message.'));
    return;
  }

  const isAutoCommit = args[0] === 'commit' && args[1] === 'auto';

  if (isAutoCommit) {
    console.log(renderInfo('Analyzing staged changes...'));
    const diff = getStagedDiff();
    
    if (!diff.success || !diff.output) {
      console.log(renderError('No staged changes found. Run `git add` first.'));
      return;
    }

    console.log(renderInfo('Generating commit message...'));
    const prompt = `Generate a concise, conventional commit message for the following git diff. Output ONLY the commit message (e.g., "feat: add login system"). Do not use quotes, markdown blocks, or extra explanations.\n\nDiff:\n${diff.output}`;
    
    // We don't stream this directly to the user, we capture it
    const gen = streamResponse(prompt, { model: state.routeModelForTask(prompt) });
    let commitMessage = '';
    for await (const event of gen) {
      if (event.type === 'chunk') commitMessage += event.text;
    }
    
    commitMessage = commitMessage.trim().replace(/^["']|["']$/g, '');
    console.log(chalk.cyan(`  Generated Message: `) + chalk.white(commitMessage));
    
    const commitResult = runGitCommand(['commit', '-m', commitMessage]);
    if (commitResult.success) {
      console.log(renderSuccess('Successfully committed changes.'));
    } else {
      console.log(renderError(`Commit failed: ${commitResult.output}`));
    }
    return;
  }

  // Standard git command execution
  console.log(chalk.gray(`> git ${args.join(' ')}\n`));
  const result = runGitCommand(args);

  if (!result.success) {
    console.log(renderError(result.output));
    return;
  }

  if (result.output) {
    console.log(result.output);
  } else {
    console.log(chalk.gray('(No output)'));
  }
  console.log();

  // AI Explanation for specific commands
  const explainable = ['status', 'diff', 'log', 'blame'].includes(args[0]);
  if (explainable && result.output) {
    console.log(renderDivider('AI Explanation'));
    const prompt = `Explain the following git ${args[0]} output concisely and clearly. If it's a diff, summarize what changed. If it's a status, tell me what needs to be done next.\n\nOutput:\n${result.output.substring(0, 4000)}`;
    const gen = streamResponse(prompt);
    await streamOutput(gen);
    
    // Add to context
    state.addToConversation('system', `User ran git ${args.join(' ')}. AI explained the output.`);
  }
}
