import { Component, Inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'timer',
  standalone: true,
  template: `
    Timer running {{ timer() }}
  `,
})
export class TimerComponent {
  protected timer: Signal<number | undefined>;

  constructor(@Inject(TimerComponent.INTERVAL) timer: number) {
    this.timer = toSignal(interval(timer));
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TimerComponent {
  export const INTERVAL = new InjectionToken<number>('Timer interval in ms', {
    factory: () => 1000,
  });
}
