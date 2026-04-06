import { ensureApiKey } from '../manager/apiKeyManager.js';

export async function* streamAnthropic(prompt, modelId) {
  const apiKey = await ensureApiKey('Anthropic');

  yield { type: 'debug', data: `Connecting to Anthropic API...` };

  const actualModel = modelId === 'claude-3-7' ? 'claude-3-7-sonnet-20250219' : modelId;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: actualModel,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API Error: ${response.status} - ${err}`);
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
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'content_block_delta' && data.delta?.text) {
            yield { type: 'chunk', text: data.delta.text };
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
}
