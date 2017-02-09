import {Level} from '../level';
import {Scope} from '../scope';
import {Stream} from '../stream';

export class Logger implements Scope {
  constructor(
    public parent: Logger,
    public description: string,
    public additionalStreams: Array<Stream> = [],
  ) {}

  newScope(description: string, additionalStreams?: Array<Stream>): Scope {
    return new Logger(this, description, additionalStreams);
  }

  info(message: string, ...args: Array<any>) {
    this.traverseUpward(Level.Info, this, message, args);
  }

  debug(message: string, ...args: Array<any>) {
    this.traverseUpward(Level.Debug, this, message, args);
  }

  warn(message: string, ...args: Array<any>) {
    this.traverseUpward(Level.Warning, this, message, args);
  }

  error(message: string, ...args: Array<any>) {
    this.traverseUpward(Level.Error, this, message, args);
  }

  dispose() {
    for (const stream of this.additionalStreams || []) {
      stream.dispose();
    }
  }

  private traverseUpward(level: Level, scope: Scope, message: string, args: Array<any>) {
    for (const stream of this.additionalStreams || []) {
      stream.buffer(level, scope, message, args);
    }

    if (this.parent) {
      this.parent.traverseUpward(level, scope, message, args);
    }
  }
}