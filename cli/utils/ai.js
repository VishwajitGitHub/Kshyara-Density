import { state } from '../state/index.js';

const MOCK_RESPONSES = {
  coding: [
    "Here is the refactored code:\n```javascript\nfunction optimized() { return true; }\n```",
    "I found a bug on line 42. You should use a Map instead of an Object for O(1) lookups.",
  ],
  reasoning: [
    "Let's break this down step by step.\n1. First, we analyze the input.\n2. Then we apply the transformation.\nTherefore, the answer is 42.",
    "The core issue is a race condition. When thread A accesses the resource, thread B might overwrite it.",
  ],
  general: [
    "I can help with that! What specific details do you need?",
    "That's an interesting question. Generally, it depends on the context.",
  ]
};

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function sendToAI(prompt, options = {}) {
  const modelId = options.model || state.routeModelForTask(prompt);
  const model = state.getModelById(modelId) || state.activeModels[0];
  
  let type = 'general';
  if (/code|function|bug/i.test(prompt)) type = 'coding';
  if (/why|explain|reason/i.test(prompt)) type = 'reasoning';
  
  const responses = MOCK_RESPONSES[type];
  const content = responses[Math.floor(Math.random() * responses.length)];
  
  const tokens = Math.floor(content.length / 4);
  const cost = (tokens / 1000) * model.costPer1k;
  
  return {
    content,
    metadata: {
      model: model.name,
      tokens,
      cost,
      latency: 400 + Math.random() * 600,
      confidence: model.confidence
    }
  };
}

export async function* streamResponse(prompt, options = {}) {
  const modelId = options.model || state.routeModelForTask(prompt);
  const model = state.getModelById(modelId) || state.activeModels[0];
  
  yield { type: 'debug', data: `Routing to ${model.name}` };
  yield { type: 'start', model: model.name };
  
  const response = await sendToAI(prompt, options);
  const words = response.content.split(' ');
  
  for (const word of words) {
    yield { type: 'chunk', text: word + ' ' };
    await sleep(20 + Math.random() * 30);
  }
  
  state.incrementMessageCount(response.metadata.tokens, response.metadata.cost);
  state.addToConversation('assistant', response.content, model.name);
  
  yield { type: 'end', metadata: response.metadata };
}

export async function getResponseFromModel(prompt, modelId) {
  return sendToAI(prompt, { model: modelId });
}

export async function getAllModelResponses(prompt) {
  const models = state.getActiveModels();
  return Promise.all(models.map((m) => getResponseFromModel(prompt, m.id)));
}

export function getExecutionSteps(prompt) {
  return [
    { name: 'Intent Recognition', time: 12 },
    { name: 'Model Routing', time: 5 },
    { name: 'Context Assembly', time: 45 },
    { name: 'Generation', time: 850 },
  ];
}
