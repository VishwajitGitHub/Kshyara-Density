import { state } from '../state/index.js';
import { renderError, renderSuccess, renderDivider } from '../ui/prompt.js';
import { printTable } from '../ui/output.js';
import chalk from 'chalk';

export async function toolsCommand(args) {
  const subcmd = args[0] || 'list';
  const theme = state.getThemeColors();

  if (subcmd === 'list') {
    console.log();
    console.log(renderDivider('Tool Manager'));
    
    const tools = [
      { name: 'Web Search', id: 'web_search', status: 'Enabled', desc: 'Search the internet for real-time information' },
      { name: 'Code Runner', id: 'code_runner', status: 'Enabled', desc: 'Execute Python, JS, TS, Bash, Ruby in sandbox' },
      { name: 'File System', id: 'file_system', status: 'Enabled', desc: 'Read and write local files' },
      { name: 'Project Context', id: 'project_context', status: 'Enabled', desc: 'Analyze repository structure and dependencies' },
      { name: 'Shell Executor', id: 'shell_exec', status: 'Enabled', desc: 'Run arbitrary terminal commands' },
      { name: 'Long-Term Memory', id: 'memory', status: 'Enabled', desc: 'Save and search persistent notes' },
      { name: 'Image Analyzer', id: 'image_analyzer', status: chalk.yellow('Coming Soon'), desc: 'Analyze images and extract text' },
      { name: 'Git Assistant', id: 'git_assistant', status: chalk.yellow('Coming Soon'), desc: 'Automate commits, PRs, and diff analysis' }
    ];

    const rows = tools.map(t => [
      chalk.hex(theme.primary)(t.name),
      t.id,
      t.status === 'Enabled' ? chalk.green(t.status) : t.status,
      chalk.hex(theme.mutedDim)(t.desc)
    ]);

    printTable(['Tool Name', 'ID', 'Status', 'Description'], rows);
    console.log();
    return;
  }

  // Future: Implement toggle logic
  console.log(renderError(`Unknown tool subcommand: ${subcmd}. Usage: /tools [list]`));
}
