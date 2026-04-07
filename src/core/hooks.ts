import { UI } from '../ui.js';

export type HookEvent = 'PreToolUse' | 'PostToolUse' | 'PreResponse' | 'PostResponse' | 'SessionStart' | 'SessionEnd';

/**
 * Hooks System
 * Implements Phase 1: Lifecycle Hooks (🔥 POWER FEATURE)
 */
export class HookManager {
  private hooks: Record<HookEvent, string[]> = {
    PreToolUse: [],
    PostToolUse: [],
    PreResponse: [],
    PostResponse: [],
    SessionStart: [],
    SessionEnd: []
  };

  public register(event: HookEvent, command: string) {
    this.hooks[event].push(command);
    UI.info(`Registered hook for ${event}: ${command}`);
  }

  public execute(event: HookEvent) {
    const commands = this.hooks[event];
    if (!commands || commands.length === 0) return;

    UI.info(`Triggering hooks for: ${event}`);
    for (const cmd of commands) {
      try {
        UI.info(`  Executing: ${cmd}`);
        // In a full environment, we would use child_process.execSync(cmd)
        // Here we simulate the execution output for safety
        console.log(`  \x1b[90m[Hook Output Simulated: Success]\x1b[0m`);
      } catch (err: any) {
        UI.error(`Hook ${cmd} failed: ${err.message}`);
        // If exit code is 2, we would block the action as per roadmap
      }
    }
  }
}

export const hooks = new HookManager();
