import {stdout} from 'process';

const ansicolors = require('ansicolors');
const ansistyles = require('ansistyles');

import {Level} from '../level';

import {
  Scope,
  scopeToStrings,
} from '../scope';

export abstract class Formatter {
  public static conditionalColorized(level: Level, scope: Scope, message: string, args: Array<any>): string {
    if (stdout.isTTY) {
      return Formatter.colorizedText(level, scope, message, args);
    }
    return Formatter.simpleText(level, scope, message, args);
  }

  public static simpleText(level: Level, scope: Scope, message: string, args: Array<any>): string {
    const levelString = Level[level.toString()].toLowerCase();

    const date = new Date().toISOString();

    const scopeString = scopeToStrings(scope).join(' > ');

    return `[${date}] [${levelString}] [${scopeString}] ${message} ${formatArguments(args)}\n`;
  }

  public static colorizedText(level: Level, scope: Scope, message: string, args: Array<any>): string {
    const levelString = colorizeLevel(level);

    const date = new Date().toISOString();

    const scopeArray = scopeToStrings(scope);

    const scopeString = scopeArray.length > 0
      ? `\u{1b}[0;37m[${scopeToStrings(scope).join(ansicolors.brightCyan(' > '))}\u{1b}[0;37m]\u{1b}[=0l `
      : String();

    const coloredArgs = `\u{1b}[0;37m${formatArguments(args)}\u{1b}[=0l`;

    return `${levelString} ${scopeString}${ansistyles.bright(message)} ${coloredArgs}`;
  }
}

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

const formatArguments = (args: Array<string>): string => {
  if (args == null || args.length === 0) {
    return String();
  }

  const mapped = args.map(a => {
    switch (typeof a) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'function':
        return a.toString();
      default:
        return JSON.stringify(a, null, 2);
    }
  });

  return mapped.join(', ');
};
