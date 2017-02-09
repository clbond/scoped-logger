import {Stream} from '../stream';

export interface Target {
  newScope(description: string, additionalStreams: Array<Stream>): Target;

  info(message: string, ...args: Array<any>): void;

  warn(message: string, ...args: Array<any>): void;

  debug(message: string, ...args: Array<any>): void;

  error(message: string, ...args: Array<any>): void;

  dispose(): void;
}