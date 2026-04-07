import { DensityUI } from '../ui.js';
import { brain } from '../core/brain.js';

/**
 * Token + Cost Monitor
 * Implements Phase 3: Live display of tokens used and cost estimate.
 */
export function showCostMonitor() {
  DensityUI.divider('Token & Cost Monitor');
  
  const history = brain.getHistory();
  const totalTokens = history.reduce((acc, msg) => acc + (msg.tokens || 0), 0);
  
  // Blended average cost for simulation: $0.015 per 1k tokens
  const estimatedCost = (totalTokens / 1000) * 0.015;

  console.log(`  \x1b[36mTotal Messages:\x1b[0m  ${history.length}`);
  console.log(`  \x1b[36mTotal Tokens:\x1b[0m    ~${totalTokens.toLocaleString()}`);
  console.log(`  \x1b[36mEstimated Cost:\x1b[0m  $${estimatedCost.toFixed(4)} USD`);
  console.log();
  
  if (totalTokens > 100000) {
    DensityUI.warning('Approaching context limit. Auto-compaction will trigger soon.');
  } else {
    DensityUI.success('Context window is healthy.');
  }
  console.log();
}
