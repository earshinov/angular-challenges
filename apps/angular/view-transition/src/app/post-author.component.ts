import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-post-author',
  template: `
    <span class="text-md font-bold uppercase">Thomas Laforge</span>
    <span class="text-sm">{{ date() }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    class: 'flex flex-col justify-center',
  },
})
export class PostAuthorComponent {
  date = input.required<string>();
}
