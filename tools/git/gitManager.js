import { execSync } from 'child_process';

export function runGitCommand(args) {
  try {
    // Execute git command synchronously
    const output = execSync(`git ${args.join(' ')}`, { 
      encoding: 'utf8', 
      stdio: ['pipe', 'pipe', 'pipe'] 
    });
    return { success: true, output: output.trim() };
  } catch (error) {
    return { 
      success: false, 
      output: error.stderr ? error.stderr.toString().trim() : error.message 
    };
  }
}

export function getStagedDiff() {
  return runGitCommand(['diff', '--cached']);
}

export function getUnstagedDiff() {
  return runGitCommand(['diff']);
}
