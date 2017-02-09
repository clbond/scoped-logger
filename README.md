This is a scoped logging library for NodeJS applications. It allows you to create scoped loggers that inherit from a parent scope. When you log from that scope, you get the complete scope lineage as part of the output. It is akin to a call stack. This provides you much more detailed information about what is happening in your application. The library supports rolling file output and console output with optional ANSI colors (if the output stream is a TTY, not a pipe or a file).

To use the rolling file stream, you set a byte size threshold, a log retention threshold, and a filename template.

So for example, you wish to create a file called `log` and when it reaches 1GB, it is renamed to `log.0` and a new `log` file is created. This pattern is repeated all the way up until you reach the retention threshold, eg `log.5`. After that, the oldest log files are deleted, such that there will never be a `log.5` file if your threshold is 5. This allows you to keep a lot of log history without filling your disk with old logs, and without using complicated third-party log rolling software.

Usage example:

```typescript
import {cwd} from 'process';

import {dirname, join, resolve} from 'path';

import {
  Stream,
  ConsoleStream,
  RollerStream,
  createLogger as createScopedLogger,
} from 'scoped-logger';

const baseStreams: Array<Stream> = [
  new ConsoleStream(),
  new RollerStream({
    path: resolve(join(cwd(), 'log')),
    filenames: {
      current: 'application.log',
      previous: 'application.log.{number}',
    }
  })
];

const rootLog = createScopedLogger(String(), baseStreams);

export const createLogger = (name: string) => rootLog.newScope(name);
```

This will cause all output to be logged to standard output as well as a series of `application.log` and older `application.log.N` files.

When you start a new operation, you create a _child_ logger using `Logger::newScope(name)`, a la:

```typescript
const logger = rootLog.newScope('operation X');

for (const foo of bar) {
  myFunction(foo, logger);
}

const myFunction = foo => {
  const operationLogger = logger.newScope('operation Y');

  operationLogger.debug('Hello!'); // will print the message with scope: [operation X -> operation Y]
}
```

You can also specify additional output streams for child scopes. For example, maybe we wish to log everything related to _operation Y_ into a separate log file (in addition to the rolling log and console output of the root logger):

```typescript
import {RollerStream} from 'scoped-logger';

const roller = new RollerStream({
  path: resolve(join(cwd(), 'log')),
  filenames: {
    current: 'operationY.log',
    previous: 'operationY.log.{number}',
  }
});

const newLogger = logger.newScope('child scope', [roller]);
```