import { Component, OnInit } from '@angular/core';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { Student } from '../../model/student.model';
import {
  CardComponent,
  CardHeaderTemplateDirective,
  CardItemTemplateDirective,
} from '../../ui/card/card.component';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      [list]="students"
      (addItem)="addItem()"
      (deleteItem)="deleteItem($event)"
      customClass="bg-light-green">
      <ng-template [header]>
        <img src="assets/img/student.webp" width="200px" />
      </ng-template>
      <ng-template [item] [items]="students" let-item>
        {{ item.firstName }}
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      ::ng-deep .bg-light-green {
        background-color: rgba(0, 250, 0, 0.1);
      }
    `,
  ],
  imports: [
    CardComponent,
    CardHeaderTemplateDirective,
    CardItemTemplateDirective,
  ],
})
export class StudentCardComponent implements OnInit {
  students: Student[] = [];

  constructor(
    private http: FakeHttpService,
    private store: StudentStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchStudents$.subscribe((s) => this.store.addAll(s));
    this.store.students$.subscribe((s) => (this.students = s));
  }

  protected addItem() {
    this.store.addOne(randStudent());
  }

  protected deleteItem(id: number) {
    this.store.deleteOne(id);
  }
}
