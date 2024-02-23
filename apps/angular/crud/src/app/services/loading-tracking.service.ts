// SUGGESTION: Could use an HTTP interceptor (see `HTTP_INTERCEPTORS` in Angular docs)
// as in [this solution][1] for both loading indication and error handling.
//
// [1]: https://github.com/tomalaforge/angular-challenges/pull/288/files

import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { counter } from '../signals/counter-signal';

@Injectable({
  providedIn: 'root',
})
export class LoadingTrackingService {
  loading: Signal<boolean>;

  constructor() {
    const http = inject(HttpClient);
    const count = counter();

    const oldRequest = http.request;
    http.request = function (
      this: HttpClient,
      ...args: unknown[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Observable<any> {
      return new Observable((subscriber) => {
        count.inc();
        return (
          oldRequest
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .apply(this, args as any)
            .pipe(finalize(() => count.dec()))
            .subscribe(subscriber)
        );
      });
    };

    this.loading = computed(() => count() > 0);
  }
}
