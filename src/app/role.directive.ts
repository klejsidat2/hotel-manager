import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthService, Role } from './auth.service';

@Directive({
  selector: '[appRole]',
  standalone: true,
})
export class RoleDirective {
  appRole = input.required<Role>();

  private auth = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      if (this.auth.role() === this.appRole()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}