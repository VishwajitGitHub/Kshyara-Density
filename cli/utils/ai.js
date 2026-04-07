import { state } from '../state/index.js';
import { streamGemini } from '../../models/providers/gemini.js';
import { streamAnthropic } from '../../models/providers/anthropic.js';
import { streamOpenAICompatible } from '../../models/providers/openaiCompatible.js';
import { getSystemInstructions } from '../../memory/system/soulManager.js';

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function sendToAI(prompt, options = {}) {
  // We will accumulate the stream to return a full response
  let fullContent = '';
  let metadata = null;
  const gen = streamResponse(prompt, options);
  
  for await (const event of gen) {
    if (event.type === 'chunk') fullContent += event.text;
    if (event.type === 'end') metadata = event.metadata;
  }
  
  return { content: fullContent, metadata };
}

export async function* streamResponse(prompt, options = {}) {
  const modelId = options.model || state.routeModelForTask(prompt);
  const model = state.getModelById(modelId) || state.activeModels[0];
  
  yield { type: 'start', model: model.name };
  
  let tokenCount = 0;
  const startTime = Date.now();

  try {
    let stream;
    
    const messages = [];
    
    // Add system instructions from soul.md if present
    const soulInstructions = getSystemInstructions();
    if (soulInstructions) {
      messages.push({ role: 'system', content: soulInstructions });
    }
    
    // Build messages array from history + current prompt
    // Filter out system messages that are just internal logs, or map them to user/assistant
    const historyMessages = state.conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : (msg.role === 'system' ? 'user' : 'assistant'),
      content: msg.content
    }));
    
    messages.push(...historyMessages);
    
    // If the prompt isn't already the last message in history, add it
    if (messages.length === 0 || messages[messages.length - 1].content !== prompt) {
      messages.push({ role: 'user', content: prompt });
    }
    
    if (model.provider === 'Google') {
      stream = streamGemini(messages, modelId);
    } else if (model.provider === 'Anthropic') {
      stream = streamAnthropic(messages, modelId);
    } else if (model.provider === 'OpenAI') {
      stream = streamOpenAICompatible(messages, modelId, 'OpenAI', 'https://api.openai.com/v1/chat/completions');
    } else if (model.provider === 'Groq') {
      const groqModel = modelId === 'llama-3-3-groq' ? 'llama-3.3-70b-versatile' : modelId;
      stream = streamOpenAICompatible(messages, groqModel, 'Groq', 'https://api.groq.com/openai/v1/chat/completions');
    } else if (model.provider === 'OpenRouter') {
      const orModel = modelId === 'openrouter-auto' ? 'openrouter/auto' : modelId;
      stream = streamOpenAICompatible(messages, orModel, 'OpenRouter', 'https://openrouter.ai/api/v1/chat/completions');
    } else if (model.provider === 'DeepSeek') {
      const dsModel = modelId === 'deepseek-r1' ? 'deepseek-reasoner' : modelId;
      stream = streamOpenAICompatible(messages, dsModel, 'DeepSeek', 'https://api.deepseek.com/v1/chat/completions');
    } else {
      // Fallback to mock
      yield { type: 'chunk', text: `Mock response for ${model.name}. Provider not fully wired yet.` };
    }

    if (stream) {
      for await (const event of stream) {
        if (event.type === 'chunk') {
          tokenCount += Math.ceil(event.text.length / 4);
          yield event;
        } else if (event.type === 'debug') {
          yield event;
        }
      }
    }
  } catch (err) {
    yield { type: 'chunk', text: `\n[Error: ${err.message}]` };
  }
  
  const latency = Date.now() - startTime;
  const cost = (tokenCount / 1000) * model.costPer1k;
  
  const metadata = {
    model: model.name,
    tokens: tokenCount,
    cost,
    latency,
    confidence: model.confidence
  };

  state.incrementMessageCount(tokenCount, cost);
  
  yield { type: 'end', metadata };
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
