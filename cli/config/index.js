import path from 'path';
import os from 'os';
import fs from 'fs';

const CONFIG_DIR = path.join(os.homedir(), '.kshyara');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const SESSION_FILE = path.join(CONFIG_DIR, 'session.json');

const DEFAULT_CONFIG = {
  theme: 'kshyara-dark', verbose: false, defaultMode: 'chat', streamDelay: 15,
  user: { name: null, apiKey: null },
  models: { primary: 'gpt-4o', fallback: 'claude-3-7' },
  plugins: [],
};

function ensureDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig() {
  ensureDir();
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      return { ...DEFAULT_CONFIG, ...data };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config) {
  ensureDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function updateConfig(updates) {
  const config = loadConfig();
  const newConfig = { ...config, ...updates };
  saveConfig(newConfig);
  return newConfig;
}

export function loadSession() {
  ensureDir();
  if (fs.existsSync(SESSION_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function saveSession(session) {
  ensureDir();
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
}

export function getConfigPath() { return CONFIG_FILE; }
