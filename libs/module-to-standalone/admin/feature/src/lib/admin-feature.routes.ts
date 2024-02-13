import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'create-user',
    loadChildren: () =>
      import('./create-user/create-user.component').then(
        (m) => m.CreateUserComponent,
      ),
  },
];
