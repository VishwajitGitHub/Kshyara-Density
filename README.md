# Kshyara Density CLI

Kshyara Density is a next-generation, multi-model AI command-line assistant. It brings the power of advanced LLMs (OpenAI, Anthropic, Gemini, DeepSeek, Groq) directly into your terminal, complete with autonomous agents, a code execution sandbox, and a persistent memory system.

## Features

- **Multi-Model Routing**: Seamlessly switch between or combine responses from GPT-4o, Claude 3.7, Gemini 2.5, and DeepSeek R1.
- **Autonomous Agent Swarm (`/agent`)**: A self-healing loop where a Planner, Coder, Debugger, Critic, and Refiner work together to write, execute, and fix code automatically.
- **Code Execution Sandbox (`/run`)**: Safely execute Python, JavaScript, TypeScript, Bash, and Ruby directly from the CLI.
- **Context Awareness (`/project`, `/file`)**: Instantly inject your entire repository structure or specific files into the AI's context.
- **Git Assistant (`/git`)**: Run git commands and get AI-generated explanations of diffs, or use `/git commit auto` to automatically generate conventional commit messages.
- **Long-Term Memory (`/note`, `/memory`)**: Save persistent notes and context that survive across sessions.
- **Web Search (`/search`)**: Real-time internet search with cited sources.

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Link the CLI globally:
   ```bash
   npm run setup
   ```
4. Start the CLI:
   ```bash
   kshyara
   ```

## Configuration

On first run, you will be prompted to enter your API keys. You can also manage them later using the `/config` command.

## Core Commands

- `/ask <prompt>`: Ask a question using the default model.
- `/chat`: Enter continuous chat mode.
- `/agent <task>`: Trigger the autonomous agent swarm to build and execute code.
- `/run <code>`: Execute code in the sandbox.
- `/project`: Attach the current directory structure to the AI's context.
- `/git commit auto`: Auto-generate a commit message for staged changes.
- `/search <query>`: Search the web.
- `/memory save <note>`: Save a note to long-term memory.
- `/tools`: List all available tools and their status.
- `/theme <name>`: Switch the UI theme (e.g., `cyberpunk`, `monokai`, `dracula`).

## Architecture

KSHYARA is built with a modular architecture:
- **CLI Router**: Handles command parsing and execution.
- **State Manager**: Manages conversation history, session memory, and active models.
- **Model Providers**: Standardized interfaces for streaming responses from various AI APIs.
- **Agent Ecosystem**: Specialized agents (Planner, Coder, Critic, Refiner, Debugger) with distinct system prompts.
- **Tools**: Isolated modules for file system access, code execution, git management, and web search.

## License

MIT
