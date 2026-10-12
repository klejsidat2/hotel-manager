import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonComponent } from '../button/button.component';
import { ConfirmDirective } from '../confirm.directive';
import {
  Reservation,
  ReservationStatus,
  StatusChange,
  nightsBetween,
} from '../reservation.model';
import { RoleDirective } from '../role.directive';

@Component({
  selector: 'app-reservation-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    ConfirmDirective,
    RoleDirective,
    TranslatePipe,
    CurrencyPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './reservation-item.component.html',
  styles: `
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-left: 4px solid #a0aec0;
      border-radius: 6px;
      background: #f7fafc;
      margin-bottom: 0.5rem;
    }
    .item.confirmed {
      border-left-color: #38a169;
    }
    .item.cancelled {
      border-left-color: #c53030;
      opacity: 0.7;
    }
    .item.pending {
      border-left-color: #d69e2e;
    }
        .info a {
      color: inherit;
      text-decoration: none;
    }
    .info a:hover {
      text-decoration: underline;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .meta {
      font-size: 0.85rem;
      color: #4a5568;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
  `,
})
export class ReservationItemComponent {
  reservation = input.required<Reservation>();

  statusChange = output<StatusChange>();
  remove = output<string>();

  nights = computed(() =>
    nightsBetween(this.reservation().checkIn, this.reservation().checkOut)
  );
  total = computed(() => this.nights() * this.reservation().pricePerNight);

  setStatus(status: ReservationStatus) {
    this.statusChange.emit({ id: this.reservation().id, status });
  }
}