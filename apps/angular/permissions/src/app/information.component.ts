import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HasRolesDirective } from './has-roles.directive';
import { UserStore } from './user.store';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, HasRolesDirective],
  template: `
    <h2 class="mt-10 text-xl">Information Panel</h2>
    <!-- admin can see everything -->
    <div *hasRoles="[]">visible only for super admin</div>
    <div *hasRoles="['MANAGER']">visible if manager</div>
    <div *hasRoles="['MANAGER', 'READER']">
      visible if manager and/or reader
    </div>
    <div *hasRoles="['MANAGER', 'WRITER']">
      visible if manager and/or writer
    </div>
    <div *hasRoles="['CLIENT']">visible if client</div>
    <div>visible for everyone</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  user$ = this.userStore.user$;
  constructor(private userStore: UserStore) {}
}
