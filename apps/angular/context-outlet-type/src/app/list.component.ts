import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

interface ListItemContext<T> {
  $implicit: T;
  appList: T;
  index: number;
}

@Directive({
  selector: 'ng-template[listItemTemplate]',
  standalone: true,
})
export class ListItemTemplateDirective<T> {
  @Input({ required: true }) listItemTemplate!: T[];

  static ngTemplateContextGuard<T>(
    _directive: ListItemTemplateDirective<T>,
    ctx: unknown,
  ): ctx is ListItemContext<T> {
    return true;
  }
}

@Component({
  selector: 'list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let item of list; index as i">
      <ng-container
        *ngTemplateOutlet="
          listTemplateRef || emptyRef;
          context: { $implicit: item, appList: item, index: i }
        "></ng-container>
    </div>

    <ng-template #emptyRef>No Template</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<TItem extends object> {
  @Input() list!: TItem[];

  @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
  listTemplateRef!: TemplateRef<ListItemContext<TItem>>;
}
