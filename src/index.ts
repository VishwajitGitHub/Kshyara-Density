#!/usr/bin/env node

/**
 * Kshyara's Density CLI
 * 100% Original TypeScript Implementation
 * 
 * The Ultimate All-in-One Autonomous Agent Handler.
 */

import { DensityApp } from './app.js';

async function bootstrap() {
  const app = new DensityApp();
  await app.initialize();
}

bootstrap().catch((err) => {
  console.error('Fatal Core Error:', err);
  process.exit(1);
});
