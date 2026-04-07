import { runCode } from '../../tools/code/codeRunner.js';
import { renderError, renderSuccess, renderDivider, renderInfo } from '../ui/prompt.js';
import { state } from '../state/index.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export async function runCommand(args) {
  if (args.length < 1) {
    console.log(renderError('Usage: /run <language> <code> OR /run <filepath>'));
    return;
  }

  let language = args[0];
  let code = args.slice(1).join(' ');

  // Check if the first argument is a file path
  if (!code && fs.existsSync(path.resolve(process.cwd(), language))) {
    const filePath = path.resolve(process.cwd(), language);
    code = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath).substring(1);
    language = ext === 'js' ? 'javascript' : 
               ext === 'py' ? 'python' : 
               ext === 'ts' ? 'typescript' : 
               ext === 'sh' ? 'bash' : 
               ext === 'rb' ? 'ruby' : ext;
    console.log(renderInfo(`Running file: ${filePath} as ${language}`));
  } else if (!code) {
    console.log(renderError('Please provide code to execute or a valid file path.'));
    return;
  }

  console.log();
  console.log(renderDivider(`Execution: ${language}`));
  console.log();

  try {
    const result = await runCode(language, code);
    
    console.log();
    console.log(renderDivider('Execution Complete'));
    
    if (result.exitCode === 0) {
      console.log(renderSuccess(`Exited with code 0 in ${result.duration}ms`));
    } else {
      console.log(renderError(`Exited with code ${result.exitCode} in ${result.duration}ms`));
    }
    
    // Add to context so AI knows what happened
    const contextMsg = `User executed ${language} code.\nExit Code: ${result.exitCode}\nDuration: ${result.duration}ms\nStdout:\n${result.stdout}\nStderr:\n${result.stderr}`;
    state.addToConversation('system', contextMsg);

  } catch (err) {
    console.log(renderError(`Execution failed: ${err.message}`));
  }
  console.log();
}
