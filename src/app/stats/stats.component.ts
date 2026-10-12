import { Component, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { CardComponent } from '../card/card.component';
import { ReservationsService } from '../reservations.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CardComponent, CurrencyPipe, DecimalPipe, TranslatePipe],
  template: `
    <app-card [title]="'STATS.TITLE' | translate">
      <div class="grid">
        <div>
          <span class="label">{{ 'STATS.CONFIRMED' | translate }}</span>
          <strong>{{ service.confirmedCount() }}</strong>
        </div>
        <div>
          <span class="label">{{ 'STATS.REVENUE' | translate }}</span>
          <strong>{{ service.revenue() | currency: 'EUR' }}</strong>
        </div>
        <div>
          <span class="label">{{ 'STATS.OCCUPANCY' | translate }}</span>
          <strong>{{ service.occupancy() | number: '1.0-0' }}%</strong>
        </div>
      </div>
      <div class="bar">
        <div class="fill" [style.width.%]="service.occupancy()"></div>
      </div>
    </app-card>
  `,
  styles: `
    .grid {
      display: flex;
      gap: 2rem;
      margin-bottom: 0.75rem;
    }
    .label {
      display: block;
      font-size: 0.8rem;
      color: #718096;
    }
    strong {
      font-size: 1.3rem;
    }
    .bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      background: #38a169;
    }
  `,
})
export class StatsComponent {
  service = inject(ReservationsService);
}