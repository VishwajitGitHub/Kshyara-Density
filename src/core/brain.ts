import fs from 'fs';
import path from 'path';
import { DensityUI } from '../ui.js';

export interface ContextMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
}

/**
 * The Brain: Manages context, memory, and auto-compaction.
 * Implements Phase 1: Context System & Auto-Compaction.
 */
export class Brain {
  private history: ContextMessage[] = [];
  private maxTokens = 128000;
  private currentTokens = 0;

  constructor() {
    this.loadGlobalContext();
  }

  /**
   * Loads KSHYARA.md files from project and global directories.
   */
  private loadGlobalContext() {
    const projectContextPath = path.join(process.cwd(), '.kshyara', 'KSHYARA.md');
    
    if (fs.existsSync(projectContextPath)) {
      const content = fs.readFileSync(projectContextPath, 'utf-8');
      this.addMessage('system', `Project Context:\n${content}`);
      DensityUI.info('Loaded project context from .kshyara/KSHYARA.md');
    } else {
      // Create default if it doesn't exist
      const dir = path.dirname(projectContextPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(projectContextPath, '# Kshyara Project Context\n\nAdd project-specific rules here.\n');
    }
  }

  public addMessage(role: 'user' | 'assistant' | 'system', content: string) {
    // Rough token estimation (4 chars per token)
    const estimatedTokens = Math.ceil(content.length / 4);
    
    this.history.push({ role, content, timestamp: new Date(), tokens: estimatedTokens });
    this.currentTokens += estimatedTokens;

    if (this.currentTokens > this.maxTokens * 0.8) {
      this.autoCompact();
    }
  }

  public getHistory(): ContextMessage[] {
    return this.history;
  }

  /**
   * Circuit breaker & Auto-compaction
   * Summarizes older messages to save context window.
   */
  private autoCompact() {
    DensityUI.warning('Context window reaching limit. Auto-compacting memory...');
    
    // Keep system prompts and last 5 messages, summarize the rest
    const systemMessages = this.history.filter(m => m.role === 'system');
    const recentMessages = this.history.slice(-5);
    const toSummarize = this.history.slice(systemMessages.length, -5);

    if (toSummarize.length > 0) {
      const summaryContent = `[Compacted Memory]: The user previously discussed ${toSummarize.length} topics.`;
      const summaryMessage: ContextMessage = {
        role: 'system',
        content: summaryContent,
        timestamp: new Date(),
        tokens: Math.ceil(summaryContent.length / 4)
      };

      this.history = [...systemMessages, summaryMessage, ...recentMessages];
      this.recalculateTokens();
      DensityUI.success('Memory compacted successfully.');
    }
  }

  private recalculateTokens() {
    this.currentTokens = this.history.reduce((acc, msg) => acc + (msg.tokens || 0), 0);
  }
}

export const brain = new Brain();
