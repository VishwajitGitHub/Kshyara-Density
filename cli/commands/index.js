import { askCommand } from './ask.js';
import { chatCommand } from './chat.js';
import { clearCommand } from './clear.js';
import { combineCommand } from './combine.js';
import { configCommand } from './config.js';
import { costCommand } from './cost.js';
import { debateCommand } from './debate.js';
import { debugCommand } from './debug.js';
import { exitCommand } from './exit.js';
import { exportCommand } from './export.js';
import { helpCommand } from './help.js';
import { historyCommand } from './history.js';
import { inspectCommand } from './inspect.js';
import { loginCommand } from './login.js';
import { memoryCommand } from './memory.js';
import { modelsCommand } from './models.js';
import { refineCommand } from './refine.js';
import { searchCommand } from './search.js';
import { themeCommand } from './theme.js';

export const commands = {
  '/ask':     { handler: askCommand,     description: 'Ask a question with current model', usage: '/ask <prompt>', alias: ['/query']        },
  '/combine': { handler: combineCommand, description: 'Ask all models and merge best answer', usage: '/combine <prompt>', alias: ['/best', '/merge']},
  '/debate':  { handler: debateCommand,  description: 'Models argue opposing positions', usage: '/debate <topic>', alias: ['/argue']        },
  '/refine':  { handler: refineCommand,  description: 'Iteratively improve the last response', usage: '/refine', alias: ['/improve']      },
  '/search':  { handler: searchCommand,  description: 'Web search with cited sources', usage: '/search <query>', alias: ['/web', '/find'] },
  '/chat':    { handler: chatCommand,    description: 'Switch to chat mode', usage: '/chat'                            },
  '/models':  { handler: modelsCommand,  description: 'List and manage models', usage: '/models [list|toggle|set]', alias: ['/model', '/m']  },
  '/login':   { handler: loginCommand,   description: 'Set API key and username', usage: '/login', alias: ['/auth']         },
  '/config':  { handler: configCommand,  description: 'Manage configuration', usage: '/config [list|get|set|reset]', alias: ['/cfg']          },
  '/theme':   { handler: themeCommand,   description: 'Switch UI theme', usage: '/theme [name]'                            },
  '/memory':  { handler: memoryCommand,  description: 'Manage session memory', usage: '/memory [list|set|get|clear]', alias: ['/mem']          },
  '/history': { handler: historyCommand, description: 'Browse command history', usage: '/history', alias: ['/log']          },
  '/export':  { handler: exportCommand,  description: 'Export session to file', usage: '/export [format]', alias: ['/save']         },
  '/cost':    { handler: costCommand,    description: 'Show session cost breakdown', usage: '/cost', alias: ['/usage']        },
  '/inspect': { handler: inspectCommand, description: 'Inspect execution pipeline', usage: '/inspect', alias: ['/trace']        },
  '/debug':   { handler: debugCommand,   description: 'Toggle debug mode', usage: '/debug [on|off|status]', alias: ['/dbg']          },
  '/clear':   { handler: clearCommand,   description: 'Clear the terminal', usage: '/clear', alias: ['/cls', '/c']    },
  '/help':    { handler: helpCommand,    description: 'Show help and shortcuts', usage: '/help [command]', alias: ['/h', '/?']      },
  '/exit':    { handler: exitCommand,    description: 'Exit KSHYARA CLI', usage: '/exit', alias: ['/quit']         },
};

export function parseCommand(input) {
  const parts = input.trim().split(' ');
  const cmdName = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (commands[cmdName]) {
    return { handler: commands[cmdName].handler, args };
  }

  for (const [name, def] of Object.entries(commands)) {
    if (def.alias && def.alias.includes(cmdName)) {
      return { handler: def.handler, args };
    }
  }

  return null;
}

export function getSuggestions(partial) {
  const p = partial.toLowerCase();
  const suggestions = [];
  for (const [name, def] of Object.entries(commands)) {
    if (name.startsWith(p)) suggestions.push(name);
    if (def.alias) {
      for (const alias of def.alias) {
        if (alias.startsWith(p)) suggestions.push(alias);
      }
    }
  }
  return suggestions.sort();
}
