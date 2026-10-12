import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  readonly message = signal('');

  show(text: string) {
    this.message.set(text);
  }

  clear() {
    this.message.set('');
  }
}