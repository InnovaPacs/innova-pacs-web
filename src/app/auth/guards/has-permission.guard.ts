import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Permission } from '../enums/permissions.enum';
import { PermissionService } from '../services/permission.service';

export const hasPermissionGuard = (permission: Permission): CanActivateFn => {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    if (permissionService.hasPermission(permission)) return true;

    router.navigateByUrl('/studies/main');
    return false;
  };
};
