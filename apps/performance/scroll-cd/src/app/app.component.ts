import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, distinctUntilChanged, fromEvent } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [NgIf, AsyncPipe],
  selector: 'app-root',
  template: `
    <div>Top</div>
    <div>Middle</div>
    <div>Bottom</div>
    <button (click)="goToTop()" *ngIf="displayButton$ | async">Top</button>
  `,
  styles: [
    `
      :host {
        height: 1500px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        button {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          z-index: 1;
          padding: 1rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private ngZone = inject(NgZone);
  private ngDestroyRef = inject(DestroyRef);

  title = 'scroll-cd';

  private displayButtonSubject = new BehaviorSubject<boolean>(false);
  displayButton$ = this.displayButtonSubject.asObservable();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll')
        .pipe(
          map(() => {
            const pos = window.pageYOffset;
            return pos > 50;
          }),
          distinctUntilChanged(),
          catchError(() => EMPTY),
          takeUntilDestroyed(this.ngDestroyRef),
        )
        .subscribe((displayButton) => {
          this.ngZone.run(() => {
            this.displayButtonSubject.next(displayButton);
          });
        });
    });
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
