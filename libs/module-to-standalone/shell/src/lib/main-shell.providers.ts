import { provideToken } from '@angular-challenges/module-to-standalone/core/providers';

export function provideShell() {
  return provideToken('main-shell-token');
}
