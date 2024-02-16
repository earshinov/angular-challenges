import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import { ListItemComponent } from '../list-item/list-item.component';

export interface BaseCardItem {
  id: number;
}

@Directive({
  selector: 'ng-template[header]',
  standalone: true,
})
export class CardHeaderTemplateDirective {
  static ngTemplateContextGuard(
    dir: CardHeaderTemplateDirective,
    ctx: unknown,
  ): ctx is CardHeaderTemplateContext {
    return true;
  }

  templateRef: TemplateRef<CardHeaderTemplateContext> = inject(TemplateRef, {
    self: true,
  });
}
export interface CardHeaderTemplateContext {}

@Directive({
  selector: 'ng-template[item]',
  standalone: true,
})
export class CardItemTemplateDirective<T> {
  @Input({ required: true }) items!: Iterable<T>;

  static ngTemplateContextGuard<T>(
    dir: CardItemTemplateDirective<T>,
    ctx: unknown,
  ): ctx is CardItemTemplateContext<T> {
    return true;
  }

  templateRef: TemplateRef<CardItemTemplateContext<T>> = inject(TemplateRef, {
    self: true,
  });
}
export interface CardItemTemplateContext<T> {
  $implicit: T;
}

@Component({
  selector: 'app-card',
  template: `
    <div
      class="flex w-fit flex-col gap-3 rounded-md border-2 border-black p-4"
      [class]="customClass">
      <ng-container
        *ngTemplateOutlet="tplHeader?.templateRef || null"></ng-container>

      <section>
        <app-list-item
          *ngFor="let item of list"
          (deleteItem)="deleteItem.emit(item.id)">
          <ng-container
            *ngTemplateOutlet="
              tplItem?.templateRef || null;
              context: { $implicit: item }
            "></ng-container>
        </app-list-item>
      </section>

      <button
        class="rounded-sm border border-blue-500 bg-blue-300 p-2"
        (click)="addItem.emit()">
        Add
      </button>
    </div>
  `,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ListItemComponent,
    NgTemplateOutlet,
    CardHeaderTemplateDirective,
    CardItemTemplateDirective,
  ],
})
export class CardComponent<T extends BaseCardItem> {
  @Input() list: T[] | undefined;
  @Input() customClass = '';

  @Output() addItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<number>();

  @ContentChild(CardHeaderTemplateDirective) tplHeader:
    | CardHeaderTemplateDirective
    | undefined;
  @ContentChild(CardItemTemplateDirective) tplItem:
    | CardItemTemplateDirective<T>
    | undefined;
}
