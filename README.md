# Kshyara's Density

**Kshyara's Density** is the ultimate, all-in-one Autonomous Agent handler for your terminal. Built entirely from scratch in TypeScript, it brings the power of advanced LLMs, autonomous agent swarms, and deep web research directly to your command line.

Inspired by the best features of `gemini-cli` and `openclaw`, Density acts as your personal AI operating system.

## Features

- **100% TypeScript Architecture**: Clean, modular, and fully typed.
- **Advanced Web Researcher (`/research`)**: An autonomous loop that searches the web, scrapes articles, synthesizes information, and generates comprehensive markdown reports.
- **Autonomous Agent Swarm (`/agent`)**: A self-healing loop where a Planner, Coder, Executor, Critic, and Refiner work together to complete complex tasks.
- **Simulation Engine (`/simulate`)**: Run predictive stress tests and Monte Carlo simulations on infrastructure, scaling, or business logic.
- **Universal API Wrapper (`/api wrap`)**: Automatically fetch an OpenAPI specification and convert it into native CLI tools for the agent to use autonomously.
- **Multi-Agent Debate Mode (`/debate`)**: Watch multiple AI personas argue opposing sides of a topic before a Judge synthesizes the final verdict.
- **Token & Cost Monitor (`/cost`)**: Live tracking of your session's token usage and estimated API costs.
- **Lifecycle Hooks System**: Register commands to run automatically at `SessionStart`, `PreResponse`, `PostResponse`, and `SessionEnd`.
- **Model Context Protocol (MCP) (`/mcp`)**: Connect to external tools and databases using the standard MCP protocol.
- **OAuth 2.0 Integration (`/login`)**: Securely authenticate via a local callback server.
- **Markdown Export (`/export`)**: Export your entire chat history and research sessions to beautifully formatted Markdown files.
- **Beautiful UI**: Custom gradients, boxen borders, and chalk colors for a premium terminal experience.

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build and link the CLI globally:
   ```bash
   npm run setup
   ```
4. Start the CLI:
   ```bash
   density
   ```
   *(Alternatively, run it in dev mode without building: `npm run start`)*

## Core Commands

- `/login`: Authenticate via OAuth 2.0.
- `/research <topic>`: Trigger the advanced web researcher.
- `/agent <task>`: Trigger the autonomous agent swarm.
- `/simulate <scenario>`: Run the predictive simulation engine.
- `/api wrap <url>`: Convert an OpenAPI spec into CLI tools.
- `/debate <topic>`: Trigger the multi-agent debate mode.
- `/cost`: View live token usage and cost estimate.
- `/mcp [list|connect]`: Manage external MCP tool servers.
- `/export [filename]`: Export the current session to Markdown.
- `/help`: Show the help menu.
- `/exit`: Quit the application.

## Architecture

Density is built with a modern, scalable architecture:
- `src/index.ts`: The bootstrap entry point.
- `src/app.ts`: The core REPL loop and terminal handler.
- `src/ui.ts`: The central UI rendering engine (gradients, boxes, chalk).
- `src/core/brain.ts`: Session state, memory, and auto-compaction.
- `src/core/router.ts`: Intelligent multi-model routing.
- `src/core/hooks.ts`: Lifecycle hooks manager.
- `src/features/`: Isolated feature modules (researcher, agent, debate, simulator, api-wrapper, monitor, oauth, mcp, export).

## License

MIT
