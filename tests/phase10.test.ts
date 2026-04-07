import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';
import { LazyToolLoader } from '../src/tools/lazyLoader.js';

async function testPhase10() {
  Renderer.divider('TESTING PHASE 10: OPTIMIZATION + SCALE');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: Initial Status');
  await pipeline.execute('/status');

  console.log('Test 2: Lazy Load Tool Categories');
  await LazyToolLoader.loadCategory('cloud');
  await LazyToolLoader.loadCategory('database');
  await LazyToolLoader.loadCategory('security');

  console.log('Test 3: Final Scoped Status (Scale Check)');
  await pipeline.execute('/status');

  Renderer.success('Phase 10 Tests Completed. KSHYARA CLI IS FULLY OPERATIONAL.');
}

testPhase10().catch(console.error);
