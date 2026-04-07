import { detectProjectContext, getDirectoryTree } from '../../tools/filesystem/projectManager.js';
import { state } from '../state/index.js';
import { renderSuccess, renderInfo } from '../ui/prompt.js';

export async function projectCommand(args) {
  console.log(renderInfo('Analyzing project structure...'));
  
  const context = detectProjectContext();
  const tree = getDirectoryTree(process.cwd(), '', 0, 3);
  
  const projectSummary = `
Project Type: ${context.type}
Dependencies: ${context.dependencies.slice(0, 10).join(', ')}${context.dependencies.length > 10 ? '...' : ''}

Directory Tree (Depth 3):
${tree}
`;

  state.addToConversation('system', `User attached project context:\n${projectSummary}`);
  
  console.log(renderSuccess(`Project context attached! Detected as ${context.type}.`));
}
