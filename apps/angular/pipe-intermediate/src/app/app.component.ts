import { NgFor } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'func',
  pure: true,
  standalone: true,
})
export class FuncPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform<T, F extends (value: T, ...args: any[]) => any>(
    value: T,
    f: F,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: F extends (value: T, ...args: infer Args) => any ? Args : []
  ): ReturnType<F> {
    return f(value, ...args);
  }
}

@Component({
  standalone: true,
  imports: [NgFor, FuncPipe],
  selector: 'app-root',
  template: `
    <div *ngFor="let person of persons; let index = index; let isFirst = first">
      {{ person.name | func: showName : index }}
      {{ person.age | func: isAllowed : isFirst }}
    </div>
  `,
})
export class AppComponent {
  persons = [
    { name: 'Toto', age: 10 },
    { name: 'Jack', age: 15 },
    { name: 'John', age: 30 },
  ];

  showName(name: string, index: number) {
    // very heavy computation
    return `${name} - ${index}`;
  }

  isAllowed(age: number, isFirst: boolean) {
    if (isFirst) {
      return 'always allowed';
    } else {
      return age > 25 ? 'allowed' : 'declined';
    }
  }
}
