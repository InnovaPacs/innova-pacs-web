import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Permission } from '../../auth/enums/permissions.enum';
import { PermissionService } from '../../auth/services/permission.service';

@Directive({
  selector: '[hasPermission]',
  standalone: false,
})
export class HasPermissionDirective implements OnInit {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);

  @Input() hasPermission!: string | string[];

  ngOnInit(): void {
    const permissions = (Array.isArray(this.hasPermission)
      ? this.hasPermission
      : [this.hasPermission]) as Permission[];

    if (this.permissionService.hasAnyPermission(permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
