#!/usr/bin/env node

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { KshyaraApp } from './app.js';

const app = new KshyaraApp();
app.start();
