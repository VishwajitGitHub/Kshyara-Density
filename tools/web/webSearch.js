export async function performWebSearch(query) {
  try {
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Simple regex parsing since we might not have cheerio installed
    // But let's try to parse it manually if cheerio isn't available
    const results = [];
    
    // Regex to find search results in DDG HTML
    const resultRegex = /<a class="result__url" href="([^"]+)">[^<]+<\/a>.*?<a class="result__snippet[^>]*>(.*?)<\/a>/gs;
    const titleRegex = /<h2 class="result__title">.*?<a[^>]*>(.*?)<\/a>.*?<\/h2>/gs;
    
    // We'll use a simpler approach: split by result block
    const blocks = html.split('class="result ');
    
    for (let i = 1; i < Math.min(blocks.length, 6); i++) { // Get top 5 results
      const block = blocks[i];
      
      const urlMatch = block.match(/<a class="result__url" href="([^"]+)">/);
      const titleMatch = block.match(/<h2 class="result__title">.*?<a[^>]*>(.*?)<\/a>/s);
      const snippetMatch = block.match(/<a class="result__snippet[^>]*>(.*?)<\/a>/s);
      
      if (urlMatch && titleMatch && snippetMatch) {
        // Clean up HTML entities and tags
        const cleanTitle = titleMatch[1].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
        const cleanSnippet = snippetMatch[1].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
        let url = urlMatch[1];
        
        // DDG sometimes uses relative URLs for its own services or redirects
        if (url.startsWith('//')) url = 'https:' + url;
        else if (url.startsWith('/')) url = 'https://duckduckgo.com' + url;
        
        // Decode DDG redirect URLs
        if (url.includes('uddg=')) {
          const uddgMatch = url.match(/uddg=([^&]+)/);
          if (uddgMatch) {
            url = decodeURIComponent(uddgMatch[1]);
          }
        }
        
        results.push({
          title: cleanTitle,
          url: url,
          snippet: cleanSnippet
        });
      }
    }
    
    return results;
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
}
