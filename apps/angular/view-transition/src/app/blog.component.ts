import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ActivePostTrackingService } from './active-post-tracking.service';
import { posts } from './data';
import { Post } from './post.model';

@Component({
  selector: 'blog-thumbnail-header',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="flex gap-3">
      <img
        ngSrc="assets/profil.webp"
        alt=""
        class="rounded-full border border-black p-0.5"
        width="50"
        height="50" />
      <div class="flex flex-col justify-center gap-0.5">
        <span class="text-md font-bold uppercase">Thomas Laforge</span>
        <span class="text-sm">{{ date() }}</span>
      </div>
    </div>
    <img ngSrc="assets/angular.webp" alt="" width="50" height="50" />
  `,
  host: {
    class: 'flex w-full px-4 py-5 gap-4 justify-between',
  },
})
export class BlogThumbnailHeaderComponent {
  date = input.required<string>();
}

@Component({
  selector: 'blog-thumbnail',
  standalone: true,
  imports: [NgOptimizedImage, BlogThumbnailHeaderComponent, RouterLinkWithHref],
  template: `
    <a [routerLink]="['post', post().id]">
      <img
        [ngSrc]="post().image"
        alt=""
        width="960"
        height="540"
        class="rounded-t-3xl"
        [priority]="post().id === '1'"
        [class.app-post-img]="activePostTracker.activePostId() === post().id" />
      <h2 class="p-3 text-3xl">{{ post().title }}</h2>
      <p class="p-3">{{ post().description }}</p>
      <blog-thumbnail-header [date]="post().date" />
    </a>
  `,
  host: {
    class: 'w-full max-w-[600px] rounded-3xl border-none shadow-lg',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogThumbnailComponent {
  post = input.required<Post>();

  activePostTracker = inject(ActivePostTrackingService);
}

@Component({
  selector: 'blog',
  standalone: true,
  imports: [BlogThumbnailComponent],
  template: `
    <div
      class="fixed left-0  right-0 top-0 z-50 flex h-20 items-center justify-center border-b-2 bg-white text-4xl shadow-md">
      Blog List
    </div>
    <div class="my-20 flex h-screen flex-col items-center gap-10 border p-10">
      @for (post of posts; track post.id) {
        <blog-thumbnail [post]="post" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogComponent {
  posts = posts;
}
