import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UnknownPersonComponent } from './unknown-person/unknown-person.component';
import { WorkerService } from './worker.service';

@Component({
  standalone: true,
  imports: [CommonModule, UnknownPersonComponent],
  providers: [WorkerService],
  selector: 'app-root',
  template: `
    <unknown-person [step]="loadingPercentage()" class="relative grow" />
    <button
      class="my-3 w-fit self-center rounded-md border border-white px-4 py-2 text-2xl text-white"
      (click)="discover()">
      Discover
    </button>
    <div class="p-1 text-white">
      Progress: {{ Math.round(loadingPercentage()) }}%
    </div>
  `,
  host: {
    class: `flex flex-col h-screen w-screen bg-[#1f75c0]`,
  },
})
export class AppComponent {
  Math = Math;

  private destroyRef = inject(DestroyRef);
  private workerService = inject(WorkerService);

  readonly loadingPercentage = signal(0);

  private startLoading$$ = new Subject<void>();

  constructor() {
    this.destroyRef.onDestroy(() => this.startLoading$$.complete());

    this.startLoading$$
      .pipe(
        switchMap(() => {
          this.loadingPercentage.set(0);
          return this.workerService.heavyCalculation();
        }),
        takeUntilDestroyed(),
      )
      .subscribe((message) => {
        if (message instanceof WorkerService.HeavyCalculationProgressMessage)
          this.loadingPercentage.set(message.percentage);
      });
  }

  discover() {
    this.startLoading$$.next();
  }
}
