import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';

/**
 * UI Rendering Engine for Kshyara's Density
 */

const densityGradient = gradient(['#00f2fe', '#4facfe', '#00f2fe']);

export const UI = {
  printBanner: () => {
    const ascii = `
 ██████╗ ███████╗███╗   ██╗███████╗██╗████████╗██╗   ██╗
 ██╔══██╗██╔════╝████╗  ██║██╔════╝██║╚══██╔══╝╚██╗ ██╔╝
 ██║  ██║█████╗  ██╔██╗ ██║███████╗██║   ██║    ╚████╔╝ 
 ██║  ██║██╔══╝  ██║╚██╗██║╚════██║██║   ██║     ╚██╔╝  
 ██████╔╝███████╗██║ ╚████║███████║██║   ██║      ██║   
 ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝   ╚═╝      ╚═╝   
    `;
    
    const title = densityGradient.multiline(ascii);
    const subtitle = chalk.gray('v2.0.0 • Kshyara\\'s Density • Advanced Autonomous Agent');
    
    console.log(boxen(`${title}\n\n${subtitle}`, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      textAlignment: 'center'
    }));
  },

  getPrompt: () => {
    return `${densityGradient('◆')} ${chalk.cyan('Density')} ${chalk.gray('›')} `;
  },

  success: (msg: string) => console.log(`${chalk.green('✔')} ${msg}`),
  error: (msg: string) => console.log(`${chalk.red('✖')} ${msg}`),
  info: (msg: string) => console.log(`${chalk.blue('ℹ')} ${msg}`),
  warning: (msg: string) => console.log(`${chalk.yellow('⚠')} ${msg}`),
  
  divider: (title: string) => {
    const line = '─'.repeat(40);
    console.log(chalk.gray(`\n─── ${title} ${line}\n`));
  }
};
