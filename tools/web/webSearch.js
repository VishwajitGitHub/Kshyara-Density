import { sendToAI } from '../../cli/utils/ai.js';

// A simple simulated web search using an AI model to generate search results
// In a real production environment, this would call a Search API like Google Custom Search,
// Bing Search, or Tavily.
export async function performWebSearch(query) {
  const searchPrompt = `
You are a web search engine simulator. The user has searched for: "${query}"
Generate 3 realistic search results based on your knowledge. Format them as a JSON array of objects with 'title', 'url', and 'snippet' properties.
Do not include any other text, just the JSON array.
`;

  try {
    // We use a fast model for the search simulation
    const response = await sendToAI(searchPrompt, { model: 'gpt-4o' });
    
    // Extract JSON from the response
    const jsonMatch = response.content.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
}
