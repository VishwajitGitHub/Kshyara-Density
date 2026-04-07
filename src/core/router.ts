import { UI } from '../ui.js';

export type ModelTier = 'reasoning' | 'coding' | 'fast' | 'local';

interface ModelConfig {
  id: string;
  provider: string;
  tier: ModelTier;
  costPer1k: number;
}

/**
 * Multi-Model Router
 * Implements Phase 2: Intelligent Routing based on task.
 */
export class Router {
  private models: ModelConfig[] = [
    { id: 'deepseek-r1', provider: 'deepseek', tier: 'reasoning', costPer1k: 0.01 },
    { id: 'claude-3.7-sonnet', provider: 'anthropic', tier: 'coding', costPer1k: 0.03 },
    { id: 'gemini-2.5-flash', provider: 'google', tier: 'fast', costPer1k: 0.001 },
    { id: 'llama-3', provider: 'ollama', tier: 'local', costPer1k: 0.0 }
  ];

  /**
   * Analyzes the prompt and routes to the best model.
   */
  public route(prompt: string): ModelConfig {
    const lowerPrompt = prompt.toLowerCase();
    let selectedTier: ModelTier = 'fast';

    if (lowerPrompt.includes('why') || lowerPrompt.includes('explain') || lowerPrompt.includes('architect')) {
      selectedTier = 'reasoning';
    } else if (lowerPrompt.includes('code') || lowerPrompt.includes('function') || lowerPrompt.includes('refactor')) {
      selectedTier = 'coding';
    } else if (lowerPrompt.includes('local') || lowerPrompt.includes('private')) {
      selectedTier = 'local';
    }

    const selectedModel = this.models.find(m => m.tier === selectedTier) || this.models[2];
    
    UI.info(`Router selected \x1b[36m${selectedModel.id}\x1b[0m for task type: \x1b[33m${selectedTier}\x1b[0m`);
    return selectedModel;
  }
}

export const router = new Router();
