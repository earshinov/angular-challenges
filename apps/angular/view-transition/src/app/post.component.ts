import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { fakeTextChapters, posts } from './data';

@Component({
  selector: 'post-header',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="relative">
      <img
        ngSrc="assets/profil.webp"
        alt=""
        class="rounded-full border border-black p-0.5"
        width="50"
        height="50" />
      <img
        ngSrc="assets/angular.webp"
        alt=""
        width="30"
        height="30"
        class="absolute -bottom-2 -right-2" />
    </div>
    <span class="text-md mt-2 font-bold uppercase">Thomas Laforge</span>
    <span class="text-sm">{{ date() }}</span>
  `,
  host: {
    class: 'flex flex-col justify-center items-center',
  },
})
export class PostHeaderComponent {
  date = input.required<string>();
}

@Component({
  selector: 'post',
  standalone: true,
  imports: [NgOptimizedImage, PostHeaderComponent, RouterLink],
  template: `
    <div class="relative w-full max-w-[800px]">
      <button
        routerLink="/"
        class="absolute left-2 top-2 z-20 rounded-md border bg-white p-2">
        Back
      </button>
      <img
        [ngSrc]="post().image"
        alt=""
        width="960"
        height="540"
        class="app-post-img" />
      <h2 class="p-7 text-center text-5xl">{{ post().title }}</h2>
      <post-header [date]="post().date" class="mb-20" />
      @for (chapter of chapters; track $index) {
        <p class="mt-6 px-3">{{ chapter }}</p>
      }
    </div>
  `,
  host: {
    class: 'flex h-full justify-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PostComponent {
  chapters = fakeTextChapters;

  id = input.required<string>();
  post = computed(() => posts.filter((p) => p.id === this.id())[0]);
}
