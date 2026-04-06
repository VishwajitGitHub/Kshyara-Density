let _explicitExit = false;

export function markExplicitExit() {
  _explicitExit = true;
}

export function isExplicitExit() {
  return _explicitExit;
}
