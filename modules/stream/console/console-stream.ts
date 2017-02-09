import {Stream} from '../stream';
import {Scope} from '../../scope';
import {Level} from '../../level';
import {Formatter} from '../formatter';

export class ConsoleStream implements Stream {
  buffer(level: Level, scope: Scope, message: string, args: Array<any>) {
    switch (level) {
      case Level.Warning:
      case Level.Debug:
        console.error(Formatter.conditionalColorized(level, scope, message, args));
        break;
      default:
        console.log(Formatter.conditionalColorized(level, scope, message, args));
        break;
    }
  }

  dispose() {}
}