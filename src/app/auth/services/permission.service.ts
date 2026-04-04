import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Permission } from '../enums/permissions.enum';
import { ROLE_PERMISSIONS } from '../enums/role-permissions.map';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private authService = inject(AuthService);

  private userPermissions = computed<Permission[]>(() => {
    const user = this.authService.currentUser();
    if (!user?.roles?.length) return [];

    const permissions = new Set<Permission>();
    user.roles.forEach(role => {
      const rolePerms = ROLE_PERMISSIONS[role.name] ?? [];
      rolePerms.forEach(p => permissions.add(p));
    });

    return Array.from(permissions);
  });

  hasPermission(permission: Permission): boolean {
    return this.userPermissions().includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(p => this.userPermissions().includes(p));
  }
}
