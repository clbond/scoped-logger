import {Level} from '../../level';

import {
  Scope,
  scopeToStrings,
} from '../../scope';

export function plaintext(level: Level, scope: Scope, message: string, args: Array<any>): string {
  const levelString = Level[level.toString()].toLowerCase();

  const date = new Date().toISOString();

  const scopeString = scopeToStrings(scope).join(' > ');

  return `[${date}] [${levelString}] [${scopeString}] ${message} ${(args || []).map(a => JSON.stringify(a, null, 2))}\n`;
};
