import {Level} from '../level';

import {Scope} from '../scope';

export interface Stream {
  /// Write a message to this logging stream
  buffer(level: Level, scope: Scope, message: string, args: Array<any>): void;

  // Release the resources associated with this stream
  dispose(): void;
}