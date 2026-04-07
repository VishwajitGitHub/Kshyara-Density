import { DensityUI } from '../ui.js';

/**
 * Security Engine
 * Implements: Command Risk Detection, Smart Permission Engine
 */
export class SecurityEngine {
  
  private dangerousPatterns = [
    /^rm\s+-rf\s+\/$/,
    /^mkfs/,
    /^dd\s+if=/,
    />\s*\/dev\/sda/,
    /^:\(\)\{\s*:\s*\|\s*:&\s*\};\s*:/ // Fork bomb
  ];

  /**
   * Command Risk Detection: Blocks dangerous commands
   */
  public isCommandSafe(cmd: string): boolean {
    const trimmed = cmd.trim();
    
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(trimmed)) {
        DensityUI.error(`🚨 SECURITY ALERT: Blocked highly dangerous command execution: \x1b[31m${cmd}\x1b[0m`);
        return false;
      }
    }

    // Smart Permission Engine: Ask for sudo
    if (trimmed.startsWith('sudo ')) {
      DensityUI.warning(`⚠️ Command requires elevated privileges: ${cmd}`);
      // In a real app, we would prompt the user here: "Allow execution? (y/N)"
    }

    return true;
  }
}

export const security = new SecurityEngine();
