import { Routes } from '@angular/router';

export const userContactRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.ContactDashboardComponent,
      ),
  },
  {
    path: 'create-contact',
    loadChildren: () =>
      import('./create-contact/create-contact.component').then(
        (m) => m.CreateContactComponent,
      ),
  },
];
