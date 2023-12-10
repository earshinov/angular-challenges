import {
  DestroyRef,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, combineLatest, distinctUntilChanged, map } from 'rxjs';
import { Role } from './user.model';
import { UserStore } from './user.store';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[hasRoles]',
  standalone: true,
})
export class HasRolesDirective {
  @Input({ alias: 'hasRoles', required: true }) set roles(roles: Role[]) {
    this.roles$$.next(roles);
  }

  private roles$$ = new Subject<Role[]>();

  constructor(
    destroyRef: DestroyRef,
    templateRef: TemplateRef<Record<string, never>>,
    userStore: UserStore,
    viewContainerRef: ViewContainerRef,
  ) {
    destroyRef.onDestroy(() => this.roles$$.complete());

    combineLatest([
      userStore.user$,
      this.roles$$.pipe(map((roles) => new Set(roles))),
    ])
      .pipe(
        takeUntilDestroyed(),
        map(([user, allowedRoles]) =>
          userStore.userHasRoles(user, allowedRoles),
        ),
        distinctUntilChanged(),
      )
      .subscribe((allowed) => {
        if (allowed) viewContainerRef.createEmbeddedView(templateRef);
        else viewContainerRef.clear();
      });
  }
}
