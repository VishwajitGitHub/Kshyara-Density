import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import figures from 'figures';
import ora, { Ora } from 'ora';

export class DensityUI {
  private static theme = {
    white: '#FFFFFF',
    lightBlue: '#87CEEB',
    lightPink: '#FFB6C1',
    purple: '#A020F0',
    orange: '#FFA500',
    red: '#FF0000',
    dark: '#1A1A1A'
  };

  private static getGradient() {
    return gradient([
      this.theme.white,
      this.theme.lightBlue,
      this.theme.lightPink,
      this.theme.purple,
      this.theme.orange,
      this.theme.red
    ]);
  }

  public static banner() {
    const banner = `
    ██████╗ ███████╗███╗   ██╗███████╗██╗████████╗██╗   ██╗
    ██╔══██╗██╔════╝████╗  ██║██╔════╝██║╚══██╔══╝╚██╗ ██╔╝
    ██║  ██║█████╗  ██╔██╗ ██║███████╗██║   ██║    ╚████╔╝ 
    ██║  ██║██╔══╝  ██║╚██╗██║╚════██║██║   ██║     ╚██╔╝  
    ██████╔╝███████╗██║ ╚████║███████║██║   ██║      ██║   
    ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝   ╚═╝      ╚═╝   
    `;
    console.log(this.getGradient().multiline(banner));
    console.log(chalk.gray(`  ${figures.star} Kshyara's Density: The Ultimate AI Operating System ${figures.star}\n`));
  }

  public static info(message: string) {
    console.log(`  ${chalk.hex(this.theme.lightBlue)(figures.info)} ${message}`);
  }

  public static success(message: string) {
    console.log(`  ${chalk.hex(this.theme.lightPink)(figures.tick)} ${message}`);
  }

  public static error(message: string) {
    console.log(`  ${chalk.hex(this.theme.red)(figures.cross)} ${chalk.red(message)}`);
  }

  public static divider(title: string) {
    const line = '━'.repeat(Math.max(0, (process.stdout.columns || 80) - title.length - 10));
    console.log(chalk.gray(`\n─── ${chalk.bold.hex(this.theme.purple)(title)} ${line}\n`));
  }

  public static box(content: string, title?: string) {
    console.log(boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: this.theme.purple,
      title: title ? chalk.bold.hex(this.theme.lightBlue)(` ${title} `) : undefined,
    }));
  }

  public static spinner(text: string): Ora {
    return ora({
      text: chalk.gray(text),
      color: 'magenta',
      spinner: 'dots'
    }).start();
  }

  public static getPrompt() {
    return this.getGradient()('Density › ');
  }

  public static statusBar(status: string, model: string) {
    const bg = chalk.bgHex(this.theme.dark);
    const content = ` ${figures.pointer} ${status} ${figures.bullet} ${model} `;
    console.log(bg.hex(this.theme.lightPink)(content));
  }

  public static warning(message: string) {
    console.log(`${chalk.hex(this.theme.orange)(figures.warning)} ${message}`);
  }
}
