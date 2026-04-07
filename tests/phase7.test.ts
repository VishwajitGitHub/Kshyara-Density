import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';

async function testPhase7() {
  Renderer.divider('TESTING PHASE 7: UI SYSTEM');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: Normal Chat with Boxed Response');
  await pipeline.execute('What is the capital of Japan?');

  console.log('Test 2: Command with Status Bar');
  await pipeline.execute('/tools');

  console.log('Test 3: Autonomous Task with Animations');
  await pipeline.execute('/agent Build a hello world app.');

  Renderer.success('Phase 7 Tests Completed.');
}

testPhase7().catch(console.error);
