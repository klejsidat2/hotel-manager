import { Component } from '@angular/core';

import { ReservationListComponent } from '../reservation-list/reservation-list.component';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-reservations-page',
  imports: [StatsComponent, ReservationListComponent],
  template: `
    <app-stats />
    <app-reservation-list />
  `,
  styleUrl: '../app.css',
})
export class ReservationsPageComponent {}