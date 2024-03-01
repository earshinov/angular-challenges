import { UserComponent } from '@angular-challenges/static-dynamic-import/users';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter([
      {
        path: '',
        component: UserComponent,
      },
    ]),
  ],
};
