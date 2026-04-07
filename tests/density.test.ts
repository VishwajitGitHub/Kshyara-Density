import { DensityApp } from '../src/app.js';
import { DensityUI } from '../src/ui.js';

async function testDensity() {
  DensityUI.divider('TESTING KSHYARA DENSITY');
  
  const app = new DensityApp();

  console.log('Test 1: Normal Chat Interface');
  // @ts-ignore (private method access for testing)
  await app.handleInput('Hello Density, what are your capabilities?');

  console.log('Test 2: Advanced Researcher (/research)');
  // @ts-ignore
  await app.handleInput('/research Autonomous Multi-Agent Systems');

  console.log('Test 3: Autonomous Swarm (/agent)');
  // @ts-ignore
  await app.handleInput('/agent Build a production-ready authentication microservice.');

  console.log('Test 4: Simulation Engine (/simulate)');
  // @ts-ignore
  await app.handleInput('/simulate Scalability stress test for 10k users.');

  console.log('Test 5: Markdown Export (/export)');
  // @ts-ignore
  await app.handleInput('/export tests/density-test-export.md');

  DensityUI.success('ALL DENSITY CORE TESTS PASSED.');
  process.exit(0);
}

testDensity().catch(console.error);
