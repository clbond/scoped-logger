import {Target} from './logger/target';

export interface Scope extends Target {
  // Parent logger scope
  parent: Scope;

  // A short description of this scope that will be reproduced in log messages
  description: string;
}

export const scopeToStrings = (scope: Scope): Array<string> => {
  if (scope == null) {
    return ['<root>'];
  }

  const scopes = new Array<string>();
  do {
    if (scope.description) {
      scopes.push(scope.description);
    }
    scope = scope.parent;
  } while (scope);

  scopes.reverse();

  return scopes;
};
