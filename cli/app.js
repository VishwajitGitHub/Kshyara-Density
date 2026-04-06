import readline from 'readline';
import chalk from 'chalk';
import gradient from 'gradient-string';
import { state, MODES, MENTION_MAP } from './state/index.js';
import { loadConfig, saveSession } from './config/index.js';
import { printWelcome, printModeChange } from './ui/banner.js';
import { getPromptPrefix, renderError, renderInfo, renderDivider, getGrad } from './ui/prompt.js';
import { streamOutput } from './ui/output.js';
import { streamResponse } from './utils/ai.js';
import { createThinkingSpinner } from './ui/spinner.js';
import { parseCommand, getSuggestions, commands } from './commands/index.js';
import { loadPlugins } from './plugins/index.js';
import { runCombiner } from './core/combiner.js';
import { runDebate } from './core/debate.js';
import { isExplicitExit, markExplicitExit } from './state/exitFlag.js';

export class KshyaraApp {
  constructor() {
    this.rl = null;
    this.inputHistory = [];
    this.isProcessing = false;
    this.config = loadConfig();
  }

  async start() {
    this._applyConfig();
    loadPlugins();
    printWelcome();
    this._setupReadline();
    this._setupSignals();
    this._prompt();
  }

  _applyConfig() {
    if (this.config.theme) state.setTheme(this.config.theme);
    if (this.config.verbose) state.verbose = this.config.verbose;
    if (this.config.defaultMode) state.setMode(this.config.defaultMode);
  }

  _createRl() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
      completer: (line) => this._completer(line),
      historySize: 200,
    });

    rl.on('line', (line) => this._handleLine(line));

    rl.on('close', () => {
      // Only truly exit if the user typed /exit or /quit
      if (isExplicitExit()) return;

      // Reopen readline to keep the loop alive
      setTimeout(() => {
        if (!isExplicitExit()) {
          try {
            this.rl = this._createRl();
            this._prompt();
          } catch (_) {
            // stdin may be truly gone (piped input) — just keep process alive
          }
        }
      }, 50);
    });

    return rl;
  }

  _setupReadline() {
    this.rl = this._createRl();

    if (process.stdin.isTTY) {
      try {
        readline.emitKeypressEvents(process.stdin, this.rl);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => this._handleKeypress(str, key));
      } catch (_) { /* non-TTY — skip raw mode */ }
    }
  }

  _setupSignals() {
    process.on('SIGINT', () => {
      const theme = state.getThemeColors();
      if (this.isProcessing) {
        console.log();
        console.log(renderInfo('Request cancelled. Type /exit to quit.'));
        this.isProcessing = false;
      } else {
        console.log();
        console.log(chalk.hex(theme.mutedDim)('  Tip: type /exit or /quit to leave KSHYARA'));
      }
      this._prompt();
    });

    process.on('SIGTERM', () => {
      markExplicitExit();
      process.exit(0);
    });

    // Keep alive — prevent Node from exiting if there are no active handles
    setInterval(() => {}, 60000);
  }

  _completer(line) {
    if (line.startsWith('/')) {
      const suggestions = getSuggestions(line);
      const hits = suggestions.filter((c) => c.startsWith(line));
      return [hits.length ? hits : suggestions, line];
    }
    if (line.startsWith('@')) {
      const mentions = Object.keys(MENTION_MAP);
      const hits = mentions.filter((m) => m.startsWith(line));
      return [hits.length ? hits : mentions, line];
    }
    return [[], line];
  }

  _handleKeypress(str, key) {
    if (!key) return;

    if (key.ctrl && key.name === 'd') {
      const theme = state.getThemeColors();
      console.log();
      console.log(chalk.hex(theme.mutedDim)('  Type /exit or /quit to leave KSHYARA'));
      this._prompt();
      return;
    }

    if (key.ctrl && key.name === 'l') {
      process.stdout.write('\x1Bc');
      printWelcome();
      this._prompt();
      return;
    }

    if (key.ctrl && key.name === 'm') {
      this._cycleMode();
      return;
    }

    if (key.ctrl && key.name === 'k') {
      this._showCommandPalette();
      return;
    }

    if (key.ctrl && key.name === 'i') {
      (async () => {
        const { inspectCommand } = await import('./commands/inspect.js');
        await inspectCommand([]);
        this._prompt();
      })();
      return;
    }

    if (key.ctrl && key.name === 'e') {
      (async () => {
        const { exportCommand } = await import('./commands/export.js');
        await exportCommand([]);
        this._prompt();
      })();
      return;
    }
  }

  _cycleMode() {
    const modes = [MODES.CHAT, MODES.COMMAND, MODES.DEBUG];
    const current = modes.indexOf(state.mode);
    const next = modes[(current + 1) % modes.length];
    state.setMode(next);

    state.debug = next === MODES.DEBUG;
    state.verbose = next === MODES.DEBUG;

    printModeChange(next);
    this._prompt();
  }

  _showCommandPalette() {
    const theme = state.getThemeColors();
    const g = getGrad();

    console.log();
    console.log(renderDivider('Command Palette  (Ctrl+K)'));
    console.log();

    const allCmds = Object.entries(commands);
    const cols = 2;
    for (let i = 0; i < allCmds.length; i += cols) {
      const row = allCmds.slice(i, i + cols);
      const parts = row.map(([name, cmd]) =>
        `${chalk.hex(theme.primary)(name.padEnd(12))} ${chalk.hex(theme.mutedDim)(cmd.description.substring(0, 30).padEnd(32))}`
      );
      console.log('  ' + parts.join('  '));
    }

    console.log();
    this._prompt();
  }

  async _handleLine(line) {
    const trimmed = line.trim();

    if (!trimmed) {
      this._prompt();
      return;
    }

    if (this.inputHistory.length === 0 || this.inputHistory[this.inputHistory.length - 1] !== trimmed) {
      this.inputHistory.push(trimmed);
    }

    await this._processInput(trimmed);
  }

  async _processInput(input) {
    const theme = state.getThemeColors();

    if (input.startsWith('/')) {
      const parsed = parseCommand(input);

      if (parsed) {
        this.isProcessing = true;
        try {
          await parsed.handler(parsed.args);
        } catch (err) {
          console.log(renderError(`Command error: ${err.message}`));
        }
        this.isProcessing = false;
      } else {
        const suggestions = getSuggestions(input.split(' ')[0]);
        console.log(renderError(`Unknown command: ${input.split(' ')[0]}`));
        if (suggestions.length > 0) {
          console.log(
            `  ${chalk.hex(theme.mutedDim)('Did you mean:')} ` +
            suggestions.slice(0, 3).map((s) => chalk.hex(theme.primary)(s)).join(', ') + '?'
          );
        }
      }

      this._prompt();
      return;
    }

    const mentionMatch = input.match(/^(@\S+)\s*(.*)/s);
    if (mentionMatch) {
      const [, mention, rest] = mentionMatch;
      const mentionKey = mention.toLowerCase();
      const target = MENTION_MAP[mentionKey];
      const prompt = rest.trim() || input;

      if (target === '__all__') {
        await this._sendToAllModels(prompt || input);
        this._prompt();
        return;
      }
      if (target === '__combiner__') {
        await runCombiner(prompt || input);
        this._prompt();
        return;
      }
      if (target) {
        await this._sendToModel(prompt || input, target);
        this._prompt();
        return;
      }
    }

    if (state.mode === MODES.COMMAND) {
      console.log(
        renderInfo(
          `In command mode — use ${chalk.hex(theme.primary)('/ask')} <prompt> or ` +
          `switch to chat with ${chalk.hex(theme.primary)('/chat')}`
        )
      );
      this._prompt();
      return;
    }

    await this._sendToModel(input);
    this._prompt();
  }

  async _sendToModel(prompt, modelId) {
    state.incrementMessageCount();
    state.addToHistory({ type: 'user', content: prompt });
    state.addToConversation('user', prompt);

    this.isProcessing = true;

    const spinner = createThinkingSpinner();
    spinner.start();
    await new Promise((r) => setTimeout(r, 160));
    spinner.stop();

    try {
      const gen = streamResponse(prompt, modelId ? { model: modelId } : {});
      await streamOutput(gen);
    } catch (err) {
      console.log(renderError(`AI error: ${err.message}`));
    }

    this.isProcessing = false;
  }

  async _sendToAllModels(prompt) {
    const theme = state.getThemeColors();
    const g = getGrad();
    const models = state.getActiveModels();

    console.log();
    console.log(renderDivider(`Broadcasting to ${models.length} models`));

    for (const model of models) {
      console.log();
      console.log(
        `  ${g('▶')} ${chalk.hex(theme.primary).bold(model.name)} ` +
        chalk.hex(theme.mutedDim)(`[${model.provider}]`)
      );

      const spinner = createThinkingSpinner();
      spinner.start();
      await new Promise((r) => setTimeout(r, 120));
      spinner.stop();

      const gen = streamResponse(prompt, { model: model.id });
      await streamOutput(gen);
    }

    console.log(renderDivider(`All ${models.length} models responded`));
    console.log();
  }

  _prompt() {
    if (this.rl && !isExplicitExit()) {
      try {
        this.rl.setPrompt(getPromptPrefix());
        this.rl.prompt(true);
      } catch (_) { /* rl may be closed */ }
    }
  }
}
