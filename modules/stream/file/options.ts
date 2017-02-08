export interface RollingOptions {
  // Maximum size of a file before it is rolled
  thresholdSize?: number;

  // Number of files to keep before deletion of oldest files
  retention?: number;

  // The folder which we will write our log files to
  path?: string;

  // Filename templates for current and previous files
  filenames?: {current: string, previous: string};
}
