import { Component, computed, signal } from '@angular/core';

type Difficulty = 'easy' | 'normal';

const DIRECTIONS /* : {[k in 'LEFT' | 'RIGHT']: string} */ = {
  LEFT: 'left',
  RIGHT: 'right',
};

@Component({
  standalone: true,
  imports: [],
  selector: 'app-root',
  template: `
    <section>
      <div>
        <button mat-stroked-button (click)="difficulty.set('easy')">
          Easy
        </button>
        <button mat-stroked-button (click)="difficulty.set('normal')">
          Normal
        </button>
      </div>
      <p>Selected Difficulty: {{ difficulty() }}</p>
    </section>

    <section>
      <div>
        <button mat-stroked-button (click)="direction.set('LEFT')">Left</button>
        <button mat-stroked-button (click)="direction.set('RIGHT')">
          Right
        </button>
      </div>
      <p>{{ directionLabel() }}</p>
    </section>
  `,
  styles: `
    section {
      @apply flex flex-col mx-auto my-5 w-fit gap-2 items-center;

      > div {
        @apply flex w-fit gap-5;
      }
    }

     button {
      @apply rounded-md border px-4 py-2;
     }
  `,
})
export class AppComponent {
  readonly difficulty = signal<Difficulty>('easy');
  readonly direction = signal<keyof typeof DIRECTIONS | undefined>(undefined);

  readonly directionLabel = computed<string>(() => {
    const direction = this.direction();
    return direction
      ? `You chose to go ${DIRECTIONS[direction]}`
      : 'Choose a direction!';
  });
}
