#!/usr/bin/env tsx

/**
 * Kshyara's Density CLI
 * 100% Original TypeScript Implementation
 * 
 * Entry point for the application.
 */

import { DensityApp } from './app.js';

async function bootstrap() {
  const app = new DensityApp();
  await app.initialize();
}

bootstrap().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
