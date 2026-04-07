import fs from 'fs';
import path from 'path';
import { DensityUI } from '../ui.js';

/**
 * Personality System
 * Implements: AI Personality System (soul.md), Emotion-Aware Responses
 */
export class PersonalityEngine {
  private soulPath = path.join(process.cwd(), '.kshyara', 'soul.md');
  private currentMood: 'neutral' | 'focused' | 'creative' | 'analytical' = 'neutral';
  private personalityTraits: string = 'You are Density, a highly advanced, concise, and brilliant AI assistant.';

  constructor() {
    this.loadSoul();
  }

  private loadSoul() {
    if (fs.existsSync(this.soulPath)) {
      this.personalityTraits = fs.readFileSync(this.soulPath, 'utf-8');
      DensityUI.info('🧬 Loaded AI Personality from soul.md');
    } else {
      // Create default soul
      const dir = path.dirname(this.soulPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.soulPath, this.personalityTraits);
    }
  }

  public getSystemPrompt(): string {
    return `[PERSONALITY INJECTED]\n${this.personalityTraits}\nCurrent Mood: ${this.currentMood}`;
  }

  public adjustMood(context: string) {
    const lower = context.toLowerCase();
    if (lower.includes('error') || lower.includes('bug') || lower.includes('fix')) {
      this.currentMood = 'analytical';
    } else if (lower.includes('design') || lower.includes('idea') || lower.includes('brainstorm')) {
      this.currentMood = 'creative';
    } else {
      this.currentMood = 'focused';
    }
  }

  public getMoodPrefix(): string {
    switch(this.currentMood) {
      case 'analytical': return '🧐 [Analytical Mode]';
      case 'creative': return '✨ [Creative Mode]';
      case 'focused': return '⚡ [Focused Mode]';
      default: return '';
    }
  }
}

export const personality = new PersonalityEngine();
