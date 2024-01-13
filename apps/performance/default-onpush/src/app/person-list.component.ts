import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { CDFlashingDirective } from '@angular-challenges/shared/directives';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-person-list-input',
  template: `
    <mat-form-field class="w-4/5" cd-flash>
      <input
        placeholder="Add one member to the list"
        matInput
        type="text"
        [(ngModel)]="label"
        (keydown)="handleKey($event)" />
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  host: {
    class: 'w-full',
  },
})
export class PersonListInputComponent {
  @Output() add = new EventEmitter<string>();

  protected label = '';

  handleKey(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.add.emit(this.label);
      this.label = '';
    }
  }
}

@Component({
  selector: 'app-person-list-list',
  template: `
    <mat-list class="flex w-full">
      <div *ngIf="names?.length === 0" class="empty-list-label">Empty list</div>
      <mat-list-item
        *ngFor="let name of names"
        cd-flash
        class="text-orange-500">
        <div MatListItemLine class="flex justify-between">
          <h3 title="Name">
            {{ name }}
          </h3>
        </div>
      </mat-list-item>
      <mat-divider *ngIf="names?.length !== 0"></mat-divider>
    </mat-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
  standalone: true,
  imports: [CDFlashingDirective, CommonModule, MatChipsModule, MatListModule],
})
export class PersonListListComponent {
  @Input() names: string[] = [];
}

@Component({
  selector: 'app-person-list',
  template: `
    <h1 cd-flash class="text-center font-semibold" title="Title">
      {{ title | titlecase }}
    </h1>

    <app-person-list-input (add)="addPerson($event)" />
    <app-person-list-list [names]="names" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-col items-center',
  },
  standalone: true,
  imports: [
    CDFlashingDirective,
    CommonModule,
    PersonListInputComponent,
    PersonListListComponent,
  ],
})
export class PersonListComponent {
  @Input() names: string[] = [];
  @Input() title = '';

  protected addPerson(name: string): void {
    this.names = [...this.names, name];
  }
}
