import {cwd} from 'process';

import {resolve, join} from 'path';

import {
  closeSync,
  existsSync,
  fstatSync,
  openSync,
  renameSync,
  unlinkSync,
  writeSync,
} from 'fs';

import {Formatter} from '../formatter';
import {Level} from '../../level';
import {Scope} from '../../scope';
import {Stream} from '../stream';
import {RollingOptions} from './options';
import {recursiveCreate} from './mkdir';

const rollingOptions: RollingOptions = {
  path: cwd(),
  filenames: {
    current: 'log',
    previous: 'log.{number}',
  },
  retention: 5,
  thresholdSize: Math.pow(1024, 3),
};


export class RollerStream implements Stream {
  private fileDescriptor: number;

  private rollTimer;

  constructor(private options: RollingOptions = rollingOptions) {
    this.options = Object.assign({}, rollingOptions, options);

    this.open();
  }

  buffer(level: Level, scope: Scope, message: string, args: Array<any>) {
    if (this.opened() === false) {
      if (this.open() === false) {
        return;
      }
    }

    try {
      writeSync(this.fileDescriptor, Formatter.simpleText(level, scope, message, args));

      if (this.rollTimer) {
        clearTimeout(this.rollTimer);
      }

      this.rollTimer = setTimeout(() => this.roll(), 150);
    }
    catch (exception) {
      console.error(`Failure to write to log file: ${exception.stack}`);
    }
  }

  dispose() {
    if (this.opened()) {
      closeSync(this.fileDescriptor);
    }

    this.fileDescriptor = null;
  }

  private opened(): boolean {
    return this.fileDescriptor != null
        && this.fileDescriptor >= 0;
  }

  private get currentPath(): string {
    return resolve(join(this.options.path, this.options.filenames.current));
  }

  private open(): boolean {
    this.dispose();

    try {
      recursiveCreate(this.currentPath);

      this.fileDescriptor = openSync(this.currentPath, 'a+');
      if (this.fileDescriptor < 0) {
        throw new Error(`Open returned a sub-zero file descriptor`);
      }

      return true;
    }
    catch (e) {
      console.error(`Failed to open log file: ${e.stack}`);

      return false;
    }
  }

  private roll() {
    const stat = fstatSync(this.fileDescriptor);

    if (stat.size < this.options.thresholdSize) {
      return;
    }

    const previous = this.collectPrevious();

    if (previous.length + 1 >= this.options.retention) {
      const removals = previous.filter((v, index) => index + 1 >= this.options.retention);

      for (const file of removals) {
        unlinkSync(file);

        previous.pop();
      }
    }

    this.archiveCurrent(previous);
  }

  private resolvePrevious(index: number): string {
    const filename = this.options.filenames.previous.replace('{number}', index.toString());

    return resolve(join(this.options.path, filename));
  }

  private archiveCurrent(previous: Array<string>) {
    this.shiftPrevious(previous);

    renameSync(this.currentPath, this.resolvePrevious(0));

    this.open();
  }

  private shiftPrevious(files: Array<string>) {
    for (let iterator = files.length - 1; iterator >= 0; --iterator) {
      renameSync(files[iterator], this.resolvePrevious(iterator + 1));
    }
  }

  private collectPrevious(): Array<string> {
    let iterator = 0;

    const previous = new Array<string>();

    while (true) {
      const filename = this.resolvePrevious(iterator);

      if (existsSync(filename)) {
        previous.push(filename);
        iterator++;
      }
      else {
        break;
      }
    }

    return previous;
  }
}
