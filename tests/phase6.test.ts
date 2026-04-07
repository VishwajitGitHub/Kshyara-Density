import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';
import fs from 'fs';

async function testPhase6() {
  Renderer.divider('TESTING PHASE 6: MEMORY + CONTEXT');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: Save Knowledge');
  await pipeline.execute('/memory save The project uses TypeScript 6.0 and Gemini 2.0.');

  console.log('Test 2: List Knowledge');
  await pipeline.execute('/memory');

  console.log('Test 3: Query Knowledge');
  await pipeline.execute('/memory query Gemini');

  console.log('Test 4: Context Logging');
  await pipeline.execute('Hello world');
  // Check if brain saved it
  const brainPath = '.kshyara/memory.json';
  if (fs.existsSync(brainPath)) {
    Renderer.success('Brain context file exists.');
  }

  Renderer.success('Phase 6 Tests Completed.');
}

testPhase6().catch(console.error);
