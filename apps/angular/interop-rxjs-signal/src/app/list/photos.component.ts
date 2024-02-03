import { NgFor, NgIf } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLinkWithHref } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { NgLetModule } from 'ng-let';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Photo } from '../photo.model';
import { PhotoStore } from './photos.store';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    NgIf,
    NgFor,
    MatInputModule,
    LetDirective,
    RouterLinkWithHref,
    NgLetModule,
  ],
  template: `
    <h2 class="mb-2 text-xl">Photos</h2>

    <mat-form-field appearance="fill">
      <mat-label>Search</mat-label>
      <input
        type="text"
        matInput
        [formControl]="search"
        placeholder="find a photo" />
    </mat-form-field>

    <ng-container *ngLet="vm() as vm">
      <section class="flex flex-col">
        <!-- padding-bottom: 16px; - as below mat-form-field -->
        <section class="flex items-center gap-3" style="padding-bottom: 16px;">
          <button
            [disabled]="vm.page === 1"
            [class.bg-gray-400]="vm.page === 1"
            class="rounded-md border px-3 py-2 text-xl"
            (click)="store.previousPage()">
            <
          </button>
          <button
            [disabled]="vm.endOfPage"
            [class.bg-gray-400]="vm.endOfPage"
            class="rounded-md border px-3 py-2 text-xl"
            (click)="store.nextPage()">
            >
          </button>
          Page: {{ vm.page }} / {{ vm.pages }}
        </section>
        <mat-progress-bar
          mode="query"
          *ngIf="vm.loading"
          class="mt-5"></mat-progress-bar>
        <ul
          class="flex flex-wrap gap-4"
          *ngIf="vm.photos && vm.photos.length > 0; else noPhoto">
          <li *ngFor="let photo of vm.photos; trackBy: trackById">
            <a routerLink="detail" [queryParams]="{ photo: encode(photo) }">
              <img
                src="{{ photo.url_q }}"
                alt="{{ photo.title }}"
                class="image" />
            </a>
          </li>
        </ul>
        <ng-template #noPhoto>
          <div>No Photos found. Type a search word.</div>
        </ng-template>
        <footer class="text-red-500">
          {{ vm.error }}
        </footer>
      </section>
    </ng-container>
  `,
  providers: [PhotoStore],
  host: {
    class: 'p-5 block',
  },
})
export default class PhotosComponent {
  store = inject(PhotoStore);

  search = new FormControl(null as string | null);

  vm = computed(() => ({
    error: this.store.error(),
    loading: this.store.loading(),
    page: this.store.page(),
    pages: this.store.pages(),
    endOfPage: this.store.endOfPage(),
    photos: this.store.photos(),
  }));

  constructor() {
    effect(() => this.search.setValue(this.store.searchTerm()));

    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((search) => this.store.search(search || ''));
  }

  trackById(_index: number, photo: Photo) {
    return photo.id;
  }

  encode(photo: Photo) {
    return encodeURIComponent(JSON.stringify(photo));
  }
}
