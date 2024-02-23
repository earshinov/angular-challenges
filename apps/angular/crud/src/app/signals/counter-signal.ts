import { Signal, WritableSignal, signal } from '@angular/core';

export interface CounterSignal extends Signal<number> {
  inc(): void;
  dec(): void;
}

export function counter(): CounterSignal {
  const output = signal(0) as WritableSignal<number> & CounterSignal;
  output.inc = function () {
    this.set(this() + 1);
  };
  output.dec = function () {
    this.set(this() - 1);
  };
  return output;
}
