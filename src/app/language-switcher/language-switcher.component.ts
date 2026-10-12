import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Language, LanguageService } from '../language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  host: { '(document:keydown.escape)': 'open.set(false)' },
  template: `
    <button
      type="button"
      class="trigger"
      aria-label="Select language"
      (click)="open.set(true)"
    >
      <span [class]="'fi fi-' + lang.current().flag"></span>
      <span class="code">{{ lang.current().lang.toUpperCase() }}</span>
    </button>

    @if (open()) {
      <div class="overlay" (click)="open.set(false)">
        <div
          class="panel"
          role="dialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <div class="panel-head">
            <h2>{{ 'LANGUAGE.TITLE' | translate }}</h2>
            <button
              type="button"
              class="close"
              aria-label="Close"
              (click)="open.set(false)"
            >
              ×
            </button>
          </div>

          <div class="grid">
            @for (l of available; track l.code) {
              <button
                type="button"
                class="item"
                [class.active]="l.code === lang.current().code"
                (click)="pick(l)"
              >
                <span [class]="'fi fi-' + l.flag"></span>
                <span>{{ l.name }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem;
      border: 1px solid rgba(201, 162, 74, 0.6);
      border-radius: 2px;
      background: transparent;
      color: var(--cream, #f7f1e8);
      font: inherit;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .trigger:hover {
      background: rgba(201, 162, 74, 0.14);
      border-color: var(--gold, #c9a24a);
    }
    .code {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.14em;
    }
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 6rem 1rem 1rem;
      overflow-y: auto;
      background: rgba(20, 13, 9, 0.7);
      backdrop-filter: blur(3px);
    }
    .panel {
      width: 100%;
      max-width: 440px;
      padding: 1.2rem 1.6rem 1.6rem;
      background: var(--paper, #fffdf9);
      color: var(--text, #2b211a);
      border-top: 3px solid var(--gold, #c9a24a);
      border-radius: 4px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
    }
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--line, #e6dccd);
      margin-bottom: 1rem;
    }
    h2 {
      margin: 0 0 0.75rem;
      font-family: var(--font-title, Georgia, serif);
      font-size: 1.4rem;
      color: var(--gold-dark, #a8832f);
    }
    .close {
      background: none;
      border: none;
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      color: var(--muted, #7a6a5c);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem 0.8rem;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.7rem 0.6rem;
      border: none;
      border-left: 3px solid transparent;
      border-radius: 4px;
      background: none;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .item:hover {
      background: #f3ead9;
    }
    .item.active {
      background: #f3e6c4;
      border-left-color: var(--gold, #c9a24a);
      font-weight: 600;
    }
  `,
})
export class LanguageSwitcherComponent {
  lang = inject(LanguageService);
  open = signal(false);

  // vetëm gjuhët që kanë skedar përkthimi
  available = this.lang.all.filter((l) => this.lang.isAvailable(l));

  pick(language: Language) {
    if (!this.lang.isAvailable(language)) return;
    this.lang.set(language);
    this.open.set(false);
  }
}