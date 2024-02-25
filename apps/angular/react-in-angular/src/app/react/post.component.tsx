import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';

import ReactPost from './ReactPost';

type Post = { title: string; description: string; pictureLink: string };

@Component({
  standalone: true,
  selector: 'app-post',
  template: `
    <div #root></div>
  `,
  styles: [''],
})
export class PostComponent implements AfterViewInit, OnChanges, OnDestroy {
  post = input<Post | undefined>(undefined);
  isSelected = input<boolean>(false);
  @Output() selectPost = new EventEmitter<void>();

  @ViewChild('root') private root: ElementRef<HTMLDivElement> | undefined;
  private reactRoot: Root | undefined;

  ngAfterViewInit() {
    if (this.root) {
      this.reactRoot = createRoot(this.root.nativeElement);
      this.update();
    }
  }

  ngOnChanges() {
    this.update();
  }

  private update() {
    if (!this.reactRoot) return;
    const post = this.post();
    const reactPost = ReactPost({
      title: post?.title,
      description: post?.description,
      pictureLink: post?.pictureLink,
      selected: this.isSelected(),
      handleClick: () => {
        this.selectPost.emit();
      },
    });
    this.reactRoot.render(<React.StrictMode>{reactPost}</React.StrictMode>);
  }

  ngOnDestroy() {
    this.reactRoot?.unmount();
  }
}
