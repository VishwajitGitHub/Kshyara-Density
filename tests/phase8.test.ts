import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';

async function testPhase8() {
  Renderer.divider('TESTING PHASE 8: SECURITY');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: View Security Info');
  await pipeline.execute('/security');

  console.log('Test 2: Blocked Shell Command');
  await pipeline.execute('/run shell {"command": "rm -rf /"}');

  console.log('Test 3: Restricted Path Access');
  await pipeline.execute('/run read_file {"path": "C:/Windows/System32/config/SAM"}');

  console.log('Test 4: Safe Command');
  await pipeline.execute('/run shell {"command": "echo Security Phase 8 Verified."}');

  Renderer.success('Phase 8 Tests Completed.');
}

testPhase8().catch(console.error);
