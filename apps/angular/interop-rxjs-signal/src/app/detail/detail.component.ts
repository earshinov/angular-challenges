import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgLetModule } from 'ng-let';

import { Photo } from '../photo.model';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink, NgLetModule],
  template: `
    <ng-container *ngLet="photo() as photo">
      <img src="{{ photo.url_m }}" alt="{{ photo.title }}" class="image" />
      <p>
        <span class="font-bold">Title:</span>
        {{ photo.title }}
      </p>
      <p>
        <span class="font-bold">Owner:</span>
        {{ photo.ownername }}
      </p>
      <p>
        <span class="font-bold">Date:</span>
        {{ photo.datetaken | date }}
      </p>
      <p>
        <span class="font-bold">Tags:</span>
        {{ photo.tags }}
      </p>

      <button
        class="mt-10 rounded-md border border-black px-4 py-2"
        routerLink="">
        Back
      </button>
    </ng-container>
  `,
  host: {
    class: 'p-5 block',
  },
})
export default class DetailComponent {
  photo = input.required<Photo, string>({
    transform: (value: string) => JSON.parse(decodeURIComponent(value)),
  });
}
