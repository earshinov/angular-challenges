import { provideToken } from '@angular-challenges/module-to-standalone/core/providers';
import { Route } from '@angular/router';
import { UserShellComponent } from './user-shell.component';

export const userShellRoutes: Route[] = [
  {
    path: '',
    component: UserShellComponent,
    providers: [provideToken('user-token')],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () =>
          import('@angular-challenges/module-to-standalone/user/home').then(
            (m) => m.UserHomeComponent,
          ),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('@angular-challenges/module-to-standalone/user/contact').then(
            (m) => m.userContactRoutes,
          ),
      },
    ],
  },
];
