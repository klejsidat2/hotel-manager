import { Component, effect, inject } from '@angular/core';

import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (notifications.message()) {
      <div class="toast">{{ notifications.message() }}</div>
    }
  `,
  styles: `
    .toast {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background: #2d3748;
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
  `,
})
export class ToastComponent {
  notifications = inject(NotificationsService);

  constructor() {
    effect((onCleanup) => {
      if (this.notifications.message()) {
        const timer = setTimeout(() => this.notifications.clear(), 10000);
       onCleanup(() => clearTimeout(timer));
      }
    });
  }
}