import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';

async function testPhase5() {
  Renderer.divider('TESTING PHASE 5: AUTONOMY ENGINE');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: Full Autonomous Task');
  await pipeline.execute('/agent Refactor the authentication logic in the core module.');

  Renderer.success('Phase 5 Tests Completed.');
}

testPhase5().catch(console.error);
