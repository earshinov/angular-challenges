import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivePostTrackingService } from './active-post-tracking.service';
import { BlogScrollTrackingService } from './blog-scroll-tracking.service';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivePostTrackingService, BlogScrollTrackingService],
})
export class AppComponent {}
