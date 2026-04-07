import { Renderer } from '../ui/renderer.js';

export interface SecurityPolicy {
  blockedCommands: string[];
  restrictedPaths: string[];
  allowShell: boolean;
}

export class PolicyEngine {
  private policy: SecurityPolicy = {
    blockedCommands: ['rm -rf /', 'format', 'mkfs'],
    restrictedPaths: ['C:/Windows', '/etc', '/root'],
    allowShell: true
  };

  public validateToolUse(toolName: string, args: any): boolean {
    if (toolName === 'shell') {
      return this.validateShell(args.command);
    }
    
    if (toolName === 'write_file' || toolName === 'read_file') {
      return this.validatePath(args.path);
    }

    return true;
  }

  private validateShell(command: string): boolean {
    const isBlocked = this.policy.blockedCommands.some(cmd => command.includes(cmd));
    if (isBlocked) {
      Renderer.error(`Security Violation: Blocked command detected in shell call.`);
      return false;
    }
    return true;
  }

  private validatePath(filePath: string): boolean {
    const isRestricted = this.policy.restrictedPaths.some(p => filePath.startsWith(p));
    if (isRestricted) {
      Renderer.error(`Security Violation: Access to restricted path denied.`);
      return false;
    }
    return true;
  }
}

export const policyEngine = new PolicyEngine();
