import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-pagination',
  imports: [ButtonComponent, TranslatePipe],
  template: `
    @if (totalPages() > 1) {
      <nav>
        <button appButton class="secondary" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)">
          {{ 'PAGINATION.PREV' | translate }}
        </button>

        @for (p of pages(); track p) {
          <button
            appButton
            [class.secondary]="p !== page()"
            (click)="pageChange.emit(p)"
          >
            {{ p }}
          </button>
        }

        <button appButton class="secondary" [disabled]="page() >= totalPages()" (click)="pageChange.emit(page() + 1)">
          {{ 'PAGINATION.NEXT' | translate }}
        </button>
      </nav>
    }
  `,
  styles: `
    nav {
      display: flex;
      justify-content: center;
      gap: 0.4rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
  `,
})
export class PaginationComponent {
  page = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
}