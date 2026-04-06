import { GoogleGenAI } from '@google/genai';
import { ensureApiKey } from '../manager/apiKeyManager.js';

export async function* streamGemini(prompt, modelId) {
  const apiKey = await ensureApiKey('Google');
  
  yield { type: 'debug', data: `Connecting to Gemini API...` };

  const ai = new GoogleGenAI({ apiKey });
  
  // Map internal IDs to actual Gemini model names
  const actualModel = modelId === 'gemini-2-5' ? 'gemini-2.5-flash' : modelId;

  const responseStream = await ai.models.generateContentStream({
    model: actualModel,
    contents: prompt,
  });

  for await (const chunk of responseStream) {
    if (chunk.text) {
      yield { type: 'chunk', text: chunk.text };
    }
  }
}
