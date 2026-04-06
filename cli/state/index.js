export const MODES = {
  CHAT: 'chat',
  COMMAND: 'command',
  DEBUG: 'debug',
};

export const THEMES = {
  'kshyara-dark': {
    name: 'kshyara-dark',
    gradient: ['#f472b6', '#c084fc', '#fb923c', '#f87171', '#f9fafb'],
    primary: '#f472b6',
    secondary: '#c084fc',
    accent: '#fb923c',
    warning: '#f59e0b',
    error: '#f87171',
    muted: '#888888',
    mutedDim: '#555555',
    text: '#f9fafb',
    border: '#2a2a2e',
    surface: '#111114',
    bg: '#0d0d0f',
  },
  neon: {
    name: 'neon',
    gradient: ['#00ff9f', '#00b8ff', '#001eff', '#bd00ff', '#00ff9f'],
    primary: '#00ff9f', secondary: '#00b8ff', accent: '#bd00ff',
    warning: '#ffff00', error: '#ff0040', muted: '#44ffaa66',
    mutedDim: '#00ff9f44', text: '#e0ffe0', border: '#00ff9f33',
    surface: '#001a0a', bg: '#00080a',
  },
  minimal: {
    name: 'minimal',
    gradient: ['#ffffff', '#cccccc', '#aaaaaa', '#888888', '#ffffff'],
    primary: '#ffffff', secondary: '#aaaaaa', accent: '#ffffff',
    warning: '#dddddd', error: '#888888', muted: '#666666',
    mutedDim: '#444444', text: '#eeeeee', border: '#333333',
    surface: '#111111', bg: '#0a0a0a',
  },
  ocean: {
    name: 'ocean',
    gradient: ['#06b6d4', '#0891b2', '#0e7490', '#164e63', '#67e8f9'],
    primary: '#06b6d4', secondary: '#0891b2', accent: '#67e8f9',
    warning: '#fbbf24', error: '#f87171', muted: '#0e7490',
    mutedDim: '#164e63', text: '#ecfeff', border: '#164e63',
    surface: '#042f3e', bg: '#021a24',
  },
};

export const ALL_MODELS = [
  { id: 'gpt-4o',       name: 'GPT-4o',         provider: 'OpenAI',    specialty: 'general',     active: true,  confidence: 0.97, costPer1k: 0.005 },
  { id: 'claude-3-7',   name: 'Claude 3.7',      provider: 'Anthropic', specialty: 'reasoning',   active: true,  confidence: 0.96, costPer1k: 0.008 },
  { id: 'gemini-2-5',   name: 'Gemini 2.5',      provider: 'Google',    specialty: 'multimodal',  active: true,  confidence: 0.94, costPer1k: 0.003 },
  { id: 'deepseek-r1',  name: 'DeepSeek R1',     provider: 'DeepSeek',  specialty: 'coding',      active: false, confidence: 0.95, costPer1k: 0.001 },
  { id: 'llama-3-3-groq',name: 'LLaMA 3.3 (Groq)',provider: 'Groq',      specialty: 'speed',       active: true,  confidence: 0.89, costPer1k: 0.0005 },
  { id: 'openrouter-auto',name: 'Auto (OR)',     provider: 'OpenRouter',specialty: 'dynamic',    active: false, confidence: 0.90, costPer1k: 0.002 },
];

export const MENTION_MAP = {
  '@gpt4o': 'gpt-4o', '@gpt-4o': 'gpt-4o',
  '@claude': 'claude-3-7', '@gemini': 'gemini-2-5',
  '@deepseek': 'deepseek-r1', '@llama': 'llama-3-3',
  '@qwen': 'qwen-2-5', '@mistral': 'mistral',
  '@all': '__all__', '@combiner': '__combiner__',
  '@coder': 'deepseek-r1', '@planner': 'gpt-4o', '@critic': 'claude-3-7',
};

class AppState {
  constructor() {
    this.mode = MODES.CHAT;
    this.theme = 'kshyara-dark';
    this.verbose = false;
    this.debug = false;
    this.history = [];
    this.conversationHistory = [];
    this.plugins = [];
    this.session = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      startedAt: new Date().toISOString(),
      messageCount: 0, totalTokens: 0, totalCost: 0,
    };
    this.activeModels = JSON.parse(JSON.stringify(ALL_MODELS));
    this.memory = [];
    this.uptime = Date.now();
  }

  setMode(mode) { this.mode = mode; }
  setTheme(theme) { this.theme = theme; }
  addToHistory(entry) { this.history.push(entry); }
  addToConversation(role, content, model) { this.conversationHistory.push({ role, content, model, timestamp: Date.now() }); }
  addMemory(key, value) { this.memory.push({ key, value }); }
  getMemory(key) { return this.memory.find(m => m.key === key)?.value; }
  incrementMessageCount(tokens = 0, cost = 0) {
    this.session.messageCount++;
    this.session.totalTokens += tokens;
    this.session.totalCost += cost;
  }
  getActiveModels() { return this.activeModels.filter((m) => m.active); }
  getModelById(id) { return this.activeModels.find((m) => m.id === id); }
  toggleModel(id) {
    const model = this.getModelById(id);
    if (model) model.active = !model.active;
  }
  getThemeColors() { return THEMES[this.theme] || THEMES['kshyara-dark']; }
  getUptime() {
    const ms = Date.now() - this.uptime;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000);
    return `${m}m ${s}s`;
  }
  routeModelForTask(prompt) {
    // keyword regex matching for coding / reasoning / general routing
    if (/code|function|bug|error|refactor|test/i.test(prompt)) return 'deepseek-r1';
    if (/why|explain|reason|think|analyze/i.test(prompt)) return 'claude-3-7';
    return 'gpt-4o';
  }
}

export const state = new AppState();
