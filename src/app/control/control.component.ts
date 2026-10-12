import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-control',
  standalone: true,
  template: `
    <label>
      <span>{{ label() }}</span>
      <ng-content />
    </label>
  `,
  styles: `
    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
      font-weight: 600;
    }
    :host ::ng-deep input,
    :host ::ng-deep select {
      padding: 0.45rem 0.6rem;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      font: inherit;
      font-weight: 400;
    }
  `,
})
export class ControlComponent {
  label = input.required<string>();
}