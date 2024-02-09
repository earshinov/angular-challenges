import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

interface Person {
  name: string;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngForOf][ngForEmpty]',
  standalone: true,
})
export class NgForEmptyDirective<T> implements OnChanges {
  @Input({ required: true }) ngForEmpty!: TemplateRef<void>;
  @Input({ required: true }) ngForOf!: T[];

  private viewContainer = inject(ViewContainerRef);

  private renderedView: EmbeddedViewRef<void> | undefined;

  ngOnChanges() {
    if (this.ngForOf.length == 0 && !this.renderedView)
      this.renderedView = this.viewContainer.createEmbeddedView(
        this.ngForEmpty,
      );
    else if (this.ngForOf.length > 0 && this.renderedView) {
      this.renderedView.destroy();
      this.renderedView = undefined;
    }
  }
}

@Component({
  standalone: true,
  imports: [NgFor, NgIf, NgForEmptyDirective],
  selector: 'app-root',
  template: `
    <div *ngFor="let person of persons; empty: emptyList">
      {{ person.name }}
    </div>
    <ng-template #emptyList>The list is empty !!</ng-template>
    <p ngPreserveWhitespaces>
      <button (click)="addPerson($event)">Add person</button>
      <button (click)="removePerson($event)">Remove person</button>
    </p>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected persons: Person[] = [];

  protected addPerson(event: MouseEvent) {
    if (event.defaultPrevented) return;
    event.preventDefault();

    this.persons = [
      ...this.persons,
      {
        name: 'John Doe',
      },
    ];
  }

  protected removePerson(event: MouseEvent) {
    if (event.defaultPrevented) return;
    event.preventDefault();

    if (this.persons.length)
      this.persons = this.persons.slice(0, this.persons.length - 1);
  }
}
