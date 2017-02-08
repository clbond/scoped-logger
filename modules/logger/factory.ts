import {
  ConsoleStream,
  Stream,
  RollerStream
} from '../stream';

import {Logger} from './logger';

export const createLogger =
  (streams: Array<Stream>) => new Logger(null, String(), streams);

export const createRootLogger =
  () => new Logger(null, 'root', [new ConsoleStream(), new RollerStream()]);