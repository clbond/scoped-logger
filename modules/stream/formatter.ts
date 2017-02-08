export const formatArguments = (args: Array<string>): string => {
  if (args == null || args.length === 0) {
    return String();
  }

  const mapped = args.map(a => {
    switch (typeof a) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'function':
        return a.toString();
      default:
        return JSON.stringify(a, null, 2);
    }
  });

  return mapped.join(', ');
};
