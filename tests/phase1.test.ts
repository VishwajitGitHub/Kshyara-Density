import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';

async function testPhase1() {
  Renderer.divider('TESTING PHASE 1: CORE PIPELINE');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: Normal Chat Input');
  await pipeline.execute('Hello Kshyara');

  console.log('Test 2: Command Input (/help)');
  await pipeline.execute('/help');

  console.log('Test 3: Unimplemented Command');
  await pipeline.execute('/random');

  Renderer.success('Phase 1 Tests Completed.');
}

testPhase1().catch(console.error);
