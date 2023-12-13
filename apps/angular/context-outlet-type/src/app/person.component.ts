import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

interface Person {
  name: string;
  age: number;
}

interface PersonContext {
  $implicit: Person['name'];
  age: Person['age'];
}

@Directive({
  selector: 'ng-template[personTemplate]',
  standalone: true,
})
export class PersonTemplateDirective {
  static ngTemplateContextGuard(
    _directive: PersonTemplateDirective,
    ctx: unknown,
  ): ctx is PersonContext {
    return true;
  }
}

@Component({
  standalone: true,
  imports: [NgTemplateOutlet],
  selector: 'person',
  template: `
    <ng-container
      *ngTemplateOutlet="
        personTemplateRef || emptyRef;
        context: { $implicit: person.name, age: person.age }
      "></ng-container>

    <ng-template #emptyRef>No Template</ng-template>
  `,
})
export class PersonComponent {
  @Input() person!: Person;

  @ContentChild(PersonTemplateDirective, { read: TemplateRef })
  personTemplateRef!: TemplateRef<PersonContext>;
}
