import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { HeaderComponent } from '../header/header.component';
import { nightsBetween } from '../reservation.model';
import { ReservationsService } from '../reservations.service';


@Component({
  selector: 'app-reservation-details',
  imports: [HeaderComponent, RouterLink, TranslatePipe, CurrencyPipe, DatePipe],
  template: `
    <app-header />

    <main>
      @if (service.loading()) {
        <p>{{ 'DETAILS.LOADING' | translate }}</p>
      } @else if (reservation(); as r) {
        <h2>{{ r.guest }}</h2>
        <dl>
          <dt>{{ 'DETAILS.ROOM' | translate }}</dt>
          <dd>{{ r.room }}</dd>

          <dt>{{ 'DETAILS.CHECK_IN' | translate }}</dt>
          <dd>{{ r.checkIn | date: 'dd MMM y' }}</dd>

          <dt>{{ 'DETAILS.CHECK_OUT' | translate }}</dt>
          <dd>{{ r.checkOut | date: 'dd MMM y' }}</dd>

          <dt>{{ 'DETAILS.NIGHTS' | translate }}</dt>
          <dd>{{ nights() }}</dd>

          <dt>{{ 'DETAILS.TOTAL' | translate }}</dt>
          <dd>{{ nights() * r.pricePerNight | currency: 'EUR' }}</dd>

          <dt>{{ 'DETAILS.STATUS' | translate }}</dt>
          <dd>{{ 'STATUS.' + r.status | translate }}</dd>
        </dl>
      } @else {
        <p>{{ 'DETAILS.NOT_FOUND' | translate }}</p>
      }

      <a routerLink="/reservations">{{ 'DETAILS.BACK' | translate }}</a>
    </main>
  `,
  styleUrl: '../app.css',
})
export class ReservationDetailsComponent {
  service = inject(ReservationsService);

  // vjen nga URL-ja (/reservations/:id) falë withComponentInputBinding
  id = input.required<string>();

  reservation = computed(() => this.service.reservations().find((r) => r.id === this.id()));
  nights = computed(() => {
    const r = this.reservation();
    return r ? nightsBetween(r.checkIn, r.checkOut) : 0;
  });
}