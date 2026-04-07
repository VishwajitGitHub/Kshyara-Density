import { ensureApiKey } from '../manager/apiKeyManager.js';

export async function* streamOpenAICompatible(messages, modelId, providerName, baseUrl) {
  const apiKey = await ensureApiKey(providerName);

  yield { type: 'debug', data: `Connecting to ${providerName} API...` };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages,
      stream: true
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${providerName} API Error: ${response.status} - ${err}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const data = JSON.parse(line.slice(6));
          const text = data.choices[0]?.delta?.content || '';
          if (text) {
            yield { type: 'chunk', text };
          }
        } catch (e) {
          // Ignore parse errors for incomplete chunks
        }
      }
    }
  }
}
