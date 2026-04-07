import { ModelConfig, ModelTier, RouterDecision } from './types.js';

export class IntelligentRouter {
  private models: ModelConfig[] = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', tier: 'fast', contextWindow: 1048576, costPer1k: 0.0001 },
    { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'anthropic', tier: 'coding', contextWindow: 200000, costPer1k: 0.003 },
    { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'deepseek', tier: 'reasoning', contextWindow: 64000, costPer1k: 0.002 },
    { id: 'llama-3.1-8b', name: 'Llama 3.1 8B (Local)', provider: 'ollama', tier: 'local', contextWindow: 8192, costPer1k: 0.0 }
  ];

  public route(prompt: string): RouterDecision {
    const input = prompt.toLowerCase();
    
    // Advanced Routing Heuristics
    if (this.isReasoningTask(input)) {
      return { model: this.getModelByTier('reasoning'), reason: 'Task requires deep reasoning/logic.' };
    }
    
    if (this.isCodingTask(input)) {
      return { model: this.getModelByTier('coding'), reason: 'Task identified as a coding/refactoring request.' };
    }
    
    if (this.isLocalPreference(input)) {
      return { model: this.getModelByTier('local'), reason: 'User requested local/private execution.' };
    }

    return { model: this.getModelByTier('fast'), reason: 'Defaulting to fast-response flash model.' };
  }

  private isReasoningTask(input: string): boolean {
    const keywords = ['why', 'explain', 'architect', 'analyze', 'evaluate', 'complex', 'strategic'];
    return keywords.some(k => input.includes(k));
  }

  private isCodingTask(input: string): boolean {
    const keywords = ['code', 'function', 'bug', 'fix', 'refactor', 'typescript', 'javascript', 'python', 'rust'];
    return keywords.some(k => input.includes(k));
  }

  private isLocalPreference(input: string): boolean {
    return input.includes('local') || input.includes('private') || input.includes('offline');
  }

  private getModelByTier(tier: ModelTier): ModelConfig {
    return this.models.find(m => m.tier === tier) || this.models[0];
  }
}
