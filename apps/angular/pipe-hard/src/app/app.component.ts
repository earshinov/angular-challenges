import { NgFor } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { PersonUtils } from './person.utils';

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
    <div *ngFor="let activity of activities">
      {{ activity.name }} :
      <div
        *ngFor="let person of persons; let index = index; let isFirst = first">
        {{ person.name | func: PersonUtils.showName : index }}
        {{
          person.age
            | func: PersonUtils.isAllowed : isFirst : activity.minimumAge
        }}
      </div>
    </div>
  `,
})
export class AppComponent {
  PersonUtils = PersonUtils;

  persons = [
    { name: 'Toto', age: 10 },
    { name: 'Jack', age: 15 },
    { name: 'John', age: 30 },
  ];

  activities = [
    { name: 'biking', minimumAge: 12 },
    { name: 'hiking', minimumAge: 25 },
    { name: 'dancing', minimumAge: 1 },
  ];
}
