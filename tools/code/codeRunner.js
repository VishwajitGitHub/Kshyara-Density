import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function runCode(language, code) {
  const tmpDir = os.tmpdir();
  const filename = `kshyara_run_${Date.now()}`;
  let filepath = '';
  let command = '';

  if (language === 'javascript' || language === 'js' || language === 'node') {
    filepath = path.join(tmpDir, `${filename}.js`);
    fs.writeFileSync(filepath, code);
    command = `node ${filepath}`;
  } else if (language === 'python' || language === 'py') {
    filepath = path.join(tmpDir, `${filename}.py`);
    fs.writeFileSync(filepath, code);
    command = `python3 ${filepath}`;
  } else if (language === 'bash' || language === 'sh') {
    filepath = path.join(tmpDir, `${filename}.sh`);
    fs.writeFileSync(filepath, code);
    command = `bash ${filepath}`;
  } else {
    throw new Error(`Unsupported language: ${language}. Supported: js, py, sh.`);
  }

  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
    return { stdout, stderr, exitCode: 0 };
  } catch (error) {
    return { stdout: error.stdout || '', stderr: error.stderr || error.message, exitCode: error.code || 1 };
  } finally {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }
}
