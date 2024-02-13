import { IsAuthorizedGuard } from '@angular-challenges/module-to-standalone/admin/shared';
import { Route } from '@angular/router';

export const shellRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('@angular-challenges/module-to-standalone/home').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [IsAuthorizedGuard],
    loadChildren: () =>
      import('@angular-challenges/module-to-standalone/admin/feature').then(
        (m) => m.adminRoutes,
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('@angular-challenges/module-to-standalone/user/shell').then(
        (m) => m.userShellRoutes,
      ),
  },

  {
    path: 'forbidden',
    loadChildren: () =>
      import('@angular-challenges/module-to-standalone/forbidden').then(
        (m) => m.ForbiddenComponent,
      ),
  },
];
