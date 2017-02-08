const ansicolors = require('ansicolors');
const ansistyles = require('ansistyles');

import {Level} from '../../level';

import {
  Scope,
  scopeToStrings,
} from '../../scope';

export function consoleText(level: Level, scope: Scope, message: string, args: Array<any>): string {
  const levelString = colorizeLevel(level);

  const date = new Date().toISOString();

  const scopeString = `\u{1b}[0;37m[${scopeToStrings(scope).join(ansicolors.brightCyan(' > '))}\u{1b}[0;37m]\u{1b}[=0l`;

  const coloredArgs = `\u{1b}[0;37m${(args || []).map(a => JSON.stringify(a, null, 2))}\u{1b}[=0l`;

  return `${levelString} ${scopeString} ${ansistyles.bright(message)} ${coloredArgs}\n`;
};

const colorizeLevel = (level: Level): string => {
  const base = `[${Level[level.toString()].toLowerCase()}]`;

  switch (level) {
    case Level.Error:
      return ansicolors.red(base);
    case Level.Debug:
    case Level.Info:
      return ansicolors.green(base);
    case Level.Warning:
      return ansicolors.yellow(base);
    default:
      return base;
  }
}
