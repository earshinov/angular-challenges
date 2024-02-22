import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class BlogScrollTrackingService {
  private active = false;

  private _scrollTop: number | null = null;
  get scrollTop() {
    return this._scrollTop;
  }

  constructor() {
    const router = inject(Router);
    router.events
      .pipe(
        filter(() => this.active),
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this._scrollTop = window.scrollY;
      });
  }

  setActive(active: boolean) {
    this.active = active;
  }
}
