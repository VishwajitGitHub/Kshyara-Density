import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import figures from 'figures';
import ora, { Ora } from 'ora';

export class Renderer {
  private static theme = {
    primary: '#00FFA3',
    secondary: '#00D1FF',
    accent: '#FF00E5',
    error: '#FF3B30',
    warning: '#FFCC00',
    info: '#5AC8FA',
    success: '#4CD964'
  };

  public static banner() {
    const banner = `
  ██╗  ██╗███████╗██╗  ██╗██╗   ██╗ █████╗ ██████╗  █████╗ 
  ██║ ██╔╝██╔════╝██║  ██║╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗
  █████╔╝ ███████╗███████║ ╚████╔╝ ███████║██████╔╝███████║
  ██╔═██╗ ╚════██║██╔══██║  ╚██╔╝  ██╔══██║██╔══██╗██╔══██║
  ██║  ██╗███████║██║  ██║   ██║   ██║  ██║██║  ██║██║  ██║
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
    `;
    console.log(gradient([Renderer.theme.primary, Renderer.theme.secondary]).multiline(banner));
    console.log(chalk.gray(`  ${figures.star} The Most Advanced AI-Powered Terminal System ${figures.star}\n`));
  }

  public static info(message: string) {
    console.log(`${chalk.hex(Renderer.theme.info)(figures.info)} ${message}`);
  }

  public static success(message: string) {
    console.log(`${chalk.hex(Renderer.theme.success)(figures.tick)} ${message}`);
  }

  public static error(message: string) {
    console.log(`${chalk.hex(Renderer.theme.error)(figures.cross)} ${chalk.red(message)}`);
  }

  public static warning(message: string) {
    console.log(`${chalk.hex(Renderer.theme.warning)(figures.warning)} ${message}`);
  }

  public static divider(title?: string) {
    const line = '━'.repeat(process.stdout.columns - 10 || 40);
    if (title) {
      console.log(chalk.gray(`\n─── ${chalk.bold(title)} ${line.substring(title.length + 5)}\n`));
    } else {
      console.log(chalk.gray(`\n${line}\n`));
    }
  }

  public static statusBar(status: string, model: string, tokens: number) {
    const termWidth = process.stdout.columns || 80;
    const statusPart = ` ${figures.pointer} ${status} `;
    const modelPart = ` ${figures.bullet} ${model} `;
    const tokenPart = ` ${tokens} tokens `;
    
    const bg = chalk.bgHex('#1A1A1A');
    const content = bg(chalk.hex(this.theme.primary)(statusPart) + 
                       chalk.hex(this.theme.secondary)(modelPart) + 
                       chalk.gray(tokenPart));
    
    console.log(content);
  }

  public static box(content: string, title?: string) {
    console.log(boxen(content, {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: { top: 1, bottom: 1, left: 2, right: 0 },
      borderStyle: 'round',
      borderColor: Renderer.theme.secondary,
      title: title ? chalk.bold(title) : undefined,
      titleAlignment: 'left'
    }));
  }

  public static spinner(text: string): Ora {
    return ora({
      text,
      color: 'cyan',
      spinner: 'dots'
    }).start();
  }

  public static getPrompt() {
    return gradient([Renderer.theme.primary, Renderer.theme.secondary])('KSHYARA › ');
  }
}
