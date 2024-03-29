import chalk from "chalk";

export const prefixes = {
  wait: chalk.cyan("wait") + "  -",
  error: chalk.red("error") + " -",
  warn: chalk.yellow("warn") + "  -",
  ready: chalk.green("ready") + " -",
  info: chalk.cyan("info") + "  -",
  event: chalk.magenta("event") + " -",
};

const Log = {
  info: (...message: string[]) => console.log(prefixes.info, ...message),
  warn: (...message: string[]) => console.warn(prefixes.warn, ...message),
  error: (...message: string[]) => console.error(prefixes.error, ...message),
  ready: (...message: string[]) => console.log(prefixes.ready, ...message),
  wait: (...message: string[]) => console.log(prefixes.wait, ...message),
  event: (...message: string[]) => console.log(prefixes.event, ...message),
};

export default Log;
