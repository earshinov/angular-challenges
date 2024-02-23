import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { randText } from '@ngneat/falso';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingTrackingService } from './services/loading-tracking.service';
import { set } from './signals/set-signal';
import { Todo } from './todo.model';
import { TodosService } from './todos.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  selector: 'app-root',
  template: `
    <mat-progress-bar
      mode="indeterminate"
      [style.visibility]="
        loadingService.loading() ? '' : 'hidden'
      "></mat-progress-bar>
    <div *ngFor="let todo of todos">
      {{ todo.title }}
      <button
        (click)="update(todo)"
        [disabled]="todosBeingUpdated.has(todo.id)">
        Update
      </button>
      <button
        (click)="remove(todo)"
        [disabled]="todosBeingUpdated.has(todo.id)">
        Delete
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  todos!: Todo[];

  private todosService = inject(TodosService);
  protected loadingService = inject(LoadingTrackingService);
  private cd = inject(ChangeDetectorRef);

  protected todosBeingUpdated = set<number>();

  ngOnInit(): void {
    this.todosService.list().subscribe((todos) => {
      this.todos = todos;
    });
  }

  update(todo: Todo) {
    this.withTodo(todo, () =>
      this.todosService.update({
        id: todo.id,
        title: randText(),
        body: todo.body,
        userId: todo.userId,
      }),
    ).subscribe((todoUpdated) => {
      this.todos = this.todos.map((t) => (t.id === todo.id ? todoUpdated : t));
      this.cd.markForCheck();
    });
  }

  remove(todo: Todo) {
    this.withTodo(todo, () => this.todosService.remove(todo.id)).subscribe(
      () => {
        this.todos = this.todos.filter((t) => t.id !== todo.id);
        this.cd.markForCheck();
      },
    );
  }

  private withTodo<T>(todo: Todo, f: () => Observable<T>): Observable<T> {
    if (this.todosBeingUpdated.has(todo.id)) return EMPTY;
    this.todosBeingUpdated.add(todo.id);
    return f().pipe(finalize(() => this.todosBeingUpdated.remove(todo.id)));
  }
}
