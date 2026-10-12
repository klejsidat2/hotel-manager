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
            @for (l of lang.all; track l.code) {
              <button
                type="button"
                class="item"
                [class.active]="l.code === lang.current().code"
                [disabled]="!lang.isAvailable(l)"
                [title]="lang.isAvailable(l) ? '' : ('LANGUAGE.SOON' | translate)"
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
      gap: 0.4rem;
      padding: 0.35rem 0.6rem;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      background: white;
      color: #1a202c;
      font: inherit;
      cursor: pointer;
    }
    .code {
      font-size: 0.8rem;
      font-weight: 600;
    }
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 4rem 1rem 1rem;
      z-index: 1000;
      overflow-y: auto;
    }
    .panel {
      background: white;
      color: #1a202c;
      border-radius: 10px;
      width: 100%;
      max-width: 1000px;
      padding: 1rem 1.5rem 1.5rem;
    }
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 1rem;
    }
    h2 {
      color: #e8531e;
      font-size: 1.4rem;
      margin: 0 0 0.75rem;
    }
    .close {
      background: none;
      border: none;
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      color: #4a5568;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.25rem 1rem;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.5rem;
      border: none;
      border-radius: 6px;
      background: none;
      color: inherit;
      font: inherit;
      font-size: 1.05rem;
      text-align: start;
      cursor: pointer;
    }
    .item:hover:not(:disabled) {
      background: #edf2f7;
    }
    .item.active {
      background: #ebf4ff;
      font-weight: 600;
    }
    .item:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
})
export class LanguageSwitcherComponent {
  lang = inject(LanguageService);
  open = signal(false);

  pick(language: Language) {
    if (!this.lang.isAvailable(language)) return;
    this.lang.set(language);
    this.open.set(false);
  }
}