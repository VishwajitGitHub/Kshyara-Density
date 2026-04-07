import { GoogleGenAI } from '@google/genai';
import { ensureApiKey } from '../manager/apiKeyManager.js';

export async function* streamGemini(messages, modelId) {
  const apiKey = await ensureApiKey('Google');
  
  yield { type: 'debug', data: `Connecting to Gemini API...` };

  const ai = new GoogleGenAI({ apiKey });
  
  // Map internal IDs to actual Gemini model names
  const actualModel = modelId === 'gemini-2-5' ? 'gemini-2.5-flash' : modelId;

  // Convert generic messages to Gemini contents format
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const responseStream = await ai.models.generateContentStream({
    model: actualModel,
    contents: contents,
  });

  for await (const chunk of responseStream) {
    if (chunk.text) {
      yield { type: 'chunk', text: chunk.text };
    }
  }
}
