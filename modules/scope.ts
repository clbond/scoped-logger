export interface Scope {
  parent: Scope;
  description: string;
}

export const scopeToStrings = (scope: Scope): Array<string> => {
  if (scope == null) {
    return ['<root scope>'];
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
