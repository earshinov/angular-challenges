import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';

const RE_POST_URL = /\/post\/(\w+)\/?$/i;

@Injectable()
export class ActivePostTrackingService {
  private _activePostId = signal(null as null | string);
  readonly activePostId = this._activePostId.asReadonly();

  constructor() {
    const router = inject(Router);
    router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      let m: RegExpExecArray | null;
      if (
        event instanceof NavigationStart &&
        (m = RE_POST_URL.exec(event.url))
      ) {
        this._activePostId.set(m[1]);
      }
    });
  }
}
