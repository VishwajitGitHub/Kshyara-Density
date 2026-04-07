import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';

async function testPhase9() {
  Renderer.divider('TESTING PHASE 9: ADVANCED SYSTEMS');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: Run Simulation');
  await pipeline.execute('/simulate Deploy a production-ready Kubernetes cluster.');

  console.log('Test 2: Trigger Evolution Engine');
  await pipeline.execute('/evolve The capital of France is Paris.');

  Renderer.success('Phase 9 Tests Completed.');
}

testPhase9().catch(console.error);
