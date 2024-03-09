import { CDFlashingDirective } from '@angular-challenges/shared/directives';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-random',
  template: `
    <div cd-flash>I do nothing but I'm here</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CDFlashingDirective],
})
export class RandomComponent {}
