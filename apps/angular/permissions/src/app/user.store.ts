import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role, User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private user = new BehaviorSubject<User | undefined>(undefined);
  user$ = this.user.asObservable();

  add(user: User) {
    this.user.next(user);
  }

  get currentUser(): User | undefined {
    return this.user.value;
  }

  currentUserHasRoles(allowedRoles: Iterable<Role>): boolean {
    return this.userHasRoles(this.currentUser, allowedRoles);
  }

  userHasRoles(
    user: User | null | undefined,
    allowedRoles: Iterable<Role>,
  ): boolean {
    return this._userHasRoles(
      user,
      allowedRoles instanceof Set ? allowedRoles : new Set(allowedRoles),
    );
  }

  private _userHasRoles(
    user: User | null | undefined,
    allowedRoles: Set<Role>,
  ): boolean {
    return (
      user != null &&
      (user.isAdmin ||
        (allowedRoles.size > 0 &&
          user.roles.some((role) => allowedRoles.has(role))))
    );
  }
}
