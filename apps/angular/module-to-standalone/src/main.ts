import {
  provideShell,
  shellRoutes,
} from '@angular-challenges/module-to-standalone/shell';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideShell(), provideRouter(shellRoutes)],
});
