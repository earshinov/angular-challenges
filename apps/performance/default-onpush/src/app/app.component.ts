import { ChangeDetectionStrategy, Component } from '@angular/core';
import { randFirstName } from '@ngneat/falso';
import { PersonListComponent } from './person-list.component';
import { RandomComponent } from './random.component';

@Component({
  selector: 'app-root',
  template: `
    <app-random />

    <div class="flex">
      <app-person-list [names]="girlList" title="Female" />
      <app-person-list [names]="boyList" title="Male" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PersonListComponent, RandomComponent],
})
export class AppComponent {
  girlList = randFirstName({ gender: 'female', length: 10 });
  boyList = randFirstName({ gender: 'male', length: 10 });
}
