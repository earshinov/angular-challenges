import { Component, OnInit } from '@angular/core';
import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { Teacher } from '../../model/teacher.model';
import {
  CardComponent,
  CardHeaderTemplateDirective,
  CardItemTemplateDirective,
} from '../../ui/card/card.component';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      [list]="teachers"
      (addItem)="addItem()"
      (deleteItem)="deleteItem($event)"
      customClass="bg-light-red">
      <ng-template [header]>
        <img src="assets/img/teacher.png" width="200px" />
      </ng-template>
      <ng-template [item] [items]="teachers" let-item>
        {{ item.firstName }}
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      ::ng-deep .bg-light-red {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderTemplateDirective,
    CardItemTemplateDirective,
  ],
})
export class TeacherCardComponent implements OnInit {
  teachers: Teacher[] = [];

  constructor(
    private http: FakeHttpService,
    private store: TeacherStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchTeachers$.subscribe((t) => this.store.addAll(t));
    this.store.teachers$.subscribe((t) => (this.teachers = t));
  }

  protected addItem() {
    this.store.addOne(randTeacher());
  }

  protected deleteItem(id: number) {
    this.store.deleteOne(id);
  }
}
