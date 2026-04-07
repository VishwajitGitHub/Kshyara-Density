import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export class Sandbox {
  constructor() {
    this.tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kshyara-sandbox-'));
  }

  async execute(command, args, code, extension) {
    const filePath = path.join(this.tmpDir, `script.${extension}`);
    fs.writeFileSync(filePath, code, 'utf8');

    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const proc = spawn(command, [...args, filePath], {
        cwd: this.tmpDir,
        env: { ...process.env, SAFE_MODE: '1' } // Basic env isolation
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data.toString()); // Stream in real-time
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data.toString()); // Stream in real-time
      });

      proc.on('close', (code) => {
        const duration = Date.now() - startTime;
        
        // Cleanup
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}

        resolve({
          exitCode: code,
          stdout,
          stderr,
          duration
        });
      });
      
      proc.on('error', (err) => {
        resolve({
          exitCode: -1,
          stdout: '',
          stderr: err.message,
          duration: Date.now() - startTime
        });
      });
    });
  }
  
  cleanup() {
    try {
      fs.rmSync(this.tmpDir, { recursive: true, force: true });
    } catch (e) {}
  }
}
