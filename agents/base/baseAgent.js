import { sendToAI, streamResponse } from '../../cli/utils/ai.js';

export class BaseAgent {
  constructor(name, role, defaultModel) {
    this.name = name;
    this.role = role;
    this.defaultModel = defaultModel;
  }

  getSystemPrompt() {
    return `You are ${this.name}, acting as a ${this.role}.`;
  }

  async execute(prompt, options = {}) {
    const fullPrompt = `${this.getSystemPrompt()}\n\nTask:\n${prompt}`;
    return sendToAI(fullPrompt, { model: options.model || this.defaultModel });
  }

  async* streamExecute(prompt, options = {}) {
    const fullPrompt = `${this.getSystemPrompt()}\n\nTask:\n${prompt}`;
    yield* streamResponse(fullPrompt, { model: options.model || this.defaultModel });
  }
}
