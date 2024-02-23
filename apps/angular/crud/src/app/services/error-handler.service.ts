// SUGGESTION: Could use an HTTP interceptor (see `HTTP_INTERCEPTORS` in Angular docs)
// as in [this solution][1] for both loading indication and error handling.
//
// [1]: https://github.com/tomalaforge/angular-challenges/pull/288/files

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, NgZone, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export class ErrorHandlerService extends ErrorHandler {
  private snackBar = inject(MatSnackBar);
  private ngZone = inject(NgZone);

  override handleError(error: unknown): void {
    super.handleError(error);
    this.ngZone.run(() => {
      this.snackBar.open(`Error: ${stringifyError(error)}`, undefined, {
        panelClass: ['app-snack-bar-error'],
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        duration: 10 * 1000,
      });
    });
  }
}

function stringifyError(error: unknown): unknown {
  if (error instanceof HttpErrorResponse) {
    return error.message;
  }
  return error;
}
