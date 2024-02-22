import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ActivePostTrackingService } from './active-post-tracking.service';
import { posts } from './data';
import { PostAuthorComponent } from './post-author.component';
import { Post } from './post.model';

@Component({
  selector: 'blog-thumbnail-header',
  standalone: true,
  imports: [NgOptimizedImage, PostAuthorComponent],
  template: `
    <div class="flex gap-3">
      <img
        ngSrc="assets/profil.webp"
        alt=""
        class="rounded-full border border-black p-0.5"
        width="50"
        height="50"
        [class.app-vt-post-author-avatar]="enableViewTransition()" />
      <app-post-author
        [date]="date()"
        [class.app-vt-post-author]="enableViewTransition()"></app-post-author>
    </div>
    <img
      ngSrc="assets/angular.webp"
      alt=""
      width="50"
      height="50"
      [class.app-vt-post-angular-icon]="enableViewTransition()" />
  `,
  host: {
    class: 'flex w-full px-4 py-5 gap-4 justify-between',
  },
})
export class BlogThumbnailHeaderComponent {
  date = input.required<string>();
  enableViewTransition = input(false);
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
        [class.app-vt-post-img]="enableViewTransition()" />
      <h2 class="p-3 text-3xl">{{ post().title }}</h2>
      <p class="p-3">{{ post().description }}</p>
      <blog-thumbnail-header
        [date]="post().date"
        [enableViewTransition]="enableViewTransition()" />
    </a>
  `,
  host: {
    class: 'w-full max-w-[600px] rounded-3xl border-none shadow-lg',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogThumbnailComponent {
  post = input.required<Post>();

  protected enableViewTransition: Signal<boolean>;

  constructor() {
    const activePostTracker = inject(ActivePostTrackingService);
    this.enableViewTransition = computed(
      () => activePostTracker.activePostId() === this.post().id,
    );
  }
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
    <div class="my-20 flex flex-col items-center gap-10 border p-10">
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
