import { Component } from '@angular/core';

@Component({
  selector: 'button[appButton]',
  standalone: true,
  template: `<span><ng-content /></span>`,
  styles: `
    :host {
      display: inline-block;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      background:red;
      color: white;
      font: inherit;
      cursor: pointer;
    }
    :host:hover {
      background: #2c5282;
    }
    :host.danger {
      background: #c53030;
    }
    :host.secondary {
      background: #718096;
    }
  `,
})
export class ButtonComponent {}