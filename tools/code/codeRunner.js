import { Sandbox } from './sandbox.js';

const executionHistory = [];

const LANG_MAP = {
  'js': { cmd: 'node', args: [], ext: 'js' },
  'javascript': { cmd: 'node', args: [], ext: 'js' },
  'ts': { cmd: 'npx', args: ['tsx'], ext: 'ts' },
  'typescript': { cmd: 'npx', args: ['tsx'], ext: 'ts' },
  'py': { cmd: 'python3', args: [], ext: 'py' },
  'python': { cmd: 'python3', args: [], ext: 'py' },
  'sh': { cmd: 'bash', args: [], ext: 'sh' },
  'bash': { cmd: 'bash', args: [], ext: 'sh' },
  'rb': { cmd: 'ruby', args: [], ext: 'rb' },
  'ruby': { cmd: 'ruby', args: [], ext: 'rb' },
};

export async function runCode(language, code) {
  const langConfig = LANG_MAP[language.toLowerCase()];
  
  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}. Supported: js, ts, py, sh, rb.`);
  }

  const sandbox = new Sandbox();
  
  try {
    const result = await sandbox.execute(langConfig.cmd, langConfig.args, code, langConfig.ext);
    
    const record = {
      timestamp: new Date().toISOString(),
      language,
      code,
      ...result
    };
    
    executionHistory.push(record);
    if (executionHistory.length > 50) {
      executionHistory.shift(); // Keep last 50
    }
    
    return result;
  } finally {
    sandbox.cleanup();
  }
}

export function getExecutionHistory() {
  return executionHistory;
}
