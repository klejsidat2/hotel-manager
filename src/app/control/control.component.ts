import { Component, input } from '@angular/core';

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
      gap: 0.4rem;
    }
    span {
      font-size: 0.72rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--muted, #7a6a5c);
    }
    :host ::ng-deep input,
    :host ::ng-deep select {
      padding: 0.75rem 0.85rem;
      border: 1px solid var(--line, #e6dccd);
      border-radius: 3px;
      background: #fff;
      color: var(--text, #2b211a);
      font: inherit;
      font-weight: 400;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
    }
    :host ::ng-deep input:focus,
    :host ::ng-deep select:focus {
      outline: none;
      border-color: var(--gold, #c9a24a);
      box-shadow: 0 0 0 3px rgba(201, 162, 74, 0.2);
    }
  `,
})
export class ControlComponent {
  label = input.required<string>();
}