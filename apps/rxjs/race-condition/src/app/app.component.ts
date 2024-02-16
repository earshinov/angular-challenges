import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, take } from 'rxjs';
import { TopicModalComponent } from './topic-dialog.component';
import { TopicService } from './topic.service';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <button (click)="openTopicModal()">Open Topic</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private openTopicModal$$ = new Subject<void>();

  constructor() {
    const destroyRef = inject(DestroyRef);
    const dialog = inject(MatDialog);
    const topicService = inject(TopicService);

    destroyRef.onDestroy(() => this.openTopicModal$$.complete());

    // It would be better to just hide the button until topics are loaded like here:
    // https://github.com/tomalaforge/angular-challenges/pull/173/files.
    // But I guess, the topic of this exercise is RxJS
    combineLatest([
      topicService.fakeGetHttpTopic().pipe(take(1)),
      this.openTopicModal$$,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([topics, _]) => {
        dialog.open(TopicModalComponent, {
          data: { topics },
        });
      });
  }

  openTopicModal() {
    this.openTopicModal$$.next();
  }
}
