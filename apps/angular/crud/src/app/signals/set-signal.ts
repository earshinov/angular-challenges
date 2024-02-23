import { Signal, WritableSignal, signal } from '@angular/core';

export interface SetSignal<T> extends Signal<Set<T>> {
  size(): number;
  has(value: T): boolean;
  add(value: T): boolean;
  remove(value: T): void;
}

export function set<T>(): SetSignal<T> {
  const output = signal(new Set()) as WritableSignal<Set<T>> & SetSignal<T>;
  output.size = function (): number {
    return this().size;
  };
  output.has = function (value: T): boolean {
    return this().has(value);
  };
  output.add = function (value: T): boolean {
    const set = this();
    const oldSize = set.size;
    set.add(value);
    return set.size !== oldSize;
  };
  output.remove = function (value: T): boolean {
    return this().delete(value);
  };
  return output;
}
