import {dirname} from 'path';

const {sync} = require('mkpath');

export const recursiveCreate = (filePath: string) => {
  try {
    sync(dirname(filePath));
  }
  catch (exception) {
    throw new Error(`Cannot create folder ${dirname(filePath)}: ${exception.stack}`);
  }
};
