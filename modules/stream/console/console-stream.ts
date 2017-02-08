import {Stream} from '../stream';
import {Scope} from '../../scope';
import {Level} from '../../level';
import {consoleText} from './formatter';

export class ConsoleStream implements Stream {
  buffer(level: Level, scope: Scope, message: string, args: Array<any>) {
    switch (level) {
      case Level.Warning:
      case Level.Debug:
        console.error(consoleText(level, scope, message, args));
        break;
      default:
        console.log(consoleText(level, scope, message, args));
        break;
    }
  }

  dispose() {}
}