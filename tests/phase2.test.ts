import { IntelligentRouter } from '../src/router/intelligentRouter.js';
import { Renderer } from '../src/ui/renderer.js';

async function testPhase2() {
  Renderer.divider('TESTING PHASE 2: INTELLIGENT ROUTER');
  
  const router = new IntelligentRouter();

  const scenarios = [
    { input: 'How do I write a recursive function in TypeScript?', expectedTier: 'coding' },
    { input: 'Analyze the architectural benefits of microservices.', expectedTier: 'reasoning' },
    { input: 'Run this task locally and keep it private.', expectedTier: 'local' },
    { input: 'What is the capital of France?', expectedTier: 'fast' }
  ];

  for (const scenario of scenarios) {
    const decision = router.route(scenario.input);
    console.log(`Input: "${scenario.input}"`);
    console.log(`  -> Selected: ${decision.model.name} (${decision.model.tier})`);
    console.log(`  -> Reason: ${decision.reason}`);
    
    if (decision.model.tier === scenario.expectedTier) {
      Renderer.success(`Correctly routed to ${scenario.expectedTier} tier.`);
    } else {
      Renderer.error(`Routing mismatch! Expected ${scenario.expectedTier}, got ${decision.model.tier}`);
    }
    console.log('');
  }

  Renderer.success('Phase 2 Tests Completed.');
}

testPhase2().catch(console.error);
