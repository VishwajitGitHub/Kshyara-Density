export function extractCodeBlocks(markdown) {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({
      language: (match[1] || 'text').toLowerCase(),
      code: match[2].trim()
    });
  }
  return blocks;
}
