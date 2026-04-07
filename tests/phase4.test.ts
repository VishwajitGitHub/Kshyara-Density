import { CorePipeline } from '../src/core/pipeline.js';
import { Renderer } from '../src/ui/renderer.js';

async function testPhase4() {
  Renderer.divider('TESTING PHASE 4: AGENTS');
  
  const pipeline = new CorePipeline();

  console.log('Test 1: List Agents');
  await pipeline.execute('/agents');

  console.log('Test 2: Delegate to Planner');
  await pipeline.execute('@Planner Design a new authentication system.');

  console.log('Test 3: Delegate to Coder');
  await pipeline.execute('@Coder Write a Python script to scrape a website.');

  console.log('Test 4: Non-existent Agent');
  await pipeline.execute('@Ghost Do something.');

  Renderer.success('Phase 4 Tests Completed.');
}

testPhase4().catch(console.error);
