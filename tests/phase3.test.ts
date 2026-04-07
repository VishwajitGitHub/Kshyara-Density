import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';
import fs from 'fs';

async function testPhase3() {
  Renderer.divider('TESTING PHASE 3: TOOL SYSTEM');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: List Tools');
  await pipeline.execute('/tools');

  console.log('Test 2: Execute write_file');
  const testFilePath = 'tests/phase3_test.txt';
  const testContent = 'Kshyara Tool System Phase 3 Verified.';
  await pipeline.execute(`/run write_file {"path": "${testFilePath}", "content": "${testContent}"}`);

  console.log('Test 3: Execute read_file');
  await pipeline.execute(`/run read_file {"path": "${testFilePath}"}`);

  console.log('Test 4: Execute shell (dir)');
  await pipeline.execute('/run shell {"command": "dir tests/phase3_test.txt"}');

  // Cleanup
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }

  Renderer.success('Phase 3 Tests Completed.');
}

testPhase3().catch(console.error);
