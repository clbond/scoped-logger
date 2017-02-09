import {Stream} from '../stream';

import {Logger} from './logger';

export const createLogger = (description = String(), streams?: Array<Stream>) =>
  new Logger(null, description, streams || []);
