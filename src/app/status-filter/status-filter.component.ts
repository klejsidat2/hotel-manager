import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { StatusFilter } from '../reservation.model';

@Component({
  selector: 'app-status-filter',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  template: `
    <label>
      {{ 'FILTER.LABEL' | translate }}
      <select [(ngModel)]="value" name="status">
        <option value="all">{{ 'STATUS.all' | translate }}</option>
        <option value="pending">{{ 'STATUS.pending' | translate }}</option>
        <option value="confirmed">{{ 'STATUS.confirmed' | translate }}</option>
        <option value="cancelled">{{ 'STATUS.cancelled' | translate }}</option>
      </select>
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
    select {
      padding: 0.45rem 0.6rem;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      font: inherit;
      font-weight: 400;
    }
  `,
})
export class StatusFilterComponent {
  value = model<StatusFilter>('all');
}