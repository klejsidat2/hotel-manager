import { Component } from '@angular/core';

@Component({
  selector: 'button[appButton]',
  standalone: true,
  template: `<span><ng-content /></span>`,
  styles: `
    :host {
      display: inline-block;
      padding: 0.8rem 1.6rem;
      border: 1px solid var(--gold, #c9a24a);
      border-radius: 2px;
      background: var(--gold, #c9a24a);
      color: var(--ink, #1c1410);
      font: inherit;
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      cursor: pointer;
      transition:
        background 0.2s,
        border-color 0.2s,
        transform 0.2s;
    }
    :host(:hover) {
      background: #dbb55c;
      border-color: #dbb55c;
      transform: translateY(-1px);
    }
    :host(:focus-visible) {
      outline: 2px solid var(--gold-dark, #a8832f);
      outline-offset: 2px;
    }
    :host(:disabled) {
      opacity: 0.6;
      cursor: wait;
      transform: none;
    }

    :host(.secondary) {
      padding: 0.45rem 0.9rem;
      background: transparent;
      border-color: rgba(201, 162, 74, 0.6);
      color: var(--cream, #f7f1e8);
      font-size: 0.72rem;
    }
    :host(.secondary:hover) {
      background: rgba(201, 162, 74, 0.14);
      border-color: var(--gold, #c9a24a);
    }

    :host(.danger) {
      background: #9b2c2c;
      border-color: #9b2c2c;
      color: #fff;
    }
    :host(.danger:hover) {
      background: #b83a3a;
      border-color: #b83a3a;
    }
  `,
})
export class ButtonComponent {}