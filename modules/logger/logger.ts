import {Level} from '../level';
import {Scope} from '../scope';
import {Stream} from '../stream';

export class Logger implements Scope {
  constructor(
    public parent: Logger,
    public description: string,
    public additionalStreams: Array<Stream> = [],
  ) {}

  info = (message: string, ...args: Array<any>) =>
    this.stackBuffer(Level.Info, this, message, args);

  debug = (message: string, ...args: Array<any>) =>
    this.stackBuffer(Level.Debug, this, message, args);

  warn = (message: string, ...args: Array<any>) =>
    this.stackBuffer(Level.Warning, this, message, args);

  error = (message: string, ...args: Array<any>) =>
    this.stackBuffer(Level.Error, this, message, args);

  newScope(description: string, additionalStreams?: Array<Stream>) {
    return new Logger(this, description, additionalStreams);
  }

  private stackBuffer(level: Level, scope: Scope, message: string, args: Array<any>) {
    for (const stream of this.additionalStreams || []) {
      stream.buffer(level, scope, message, args);
    }

    if (this.parent) {
      this.parent.stackBuffer(level, scope, message, args);
    }
  }
}