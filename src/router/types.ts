export type ModelTier = 'reasoning' | 'coding' | 'fast' | 'local';

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  tier: ModelTier;
  contextWindow: number;
  costPer1k?: number;
}

export interface RouterDecision {
  model: ModelConfig;
  reason: string;
}

export abstract class BaseProvider {
  abstract id: string;
  abstract generate(messages: any[], modelId: string): Promise<string>;
  abstract stream?(messages: any[], modelId: string): AsyncIterable<string>;
}
