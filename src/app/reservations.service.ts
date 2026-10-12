import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { APP_CONFIG } from './app-config.token';
import { NotificationsService } from './notifications.service';
import {
  NewReservation,
  Reservation,
  ReservationStatus,
  StatusFilter,
  nightsBetween,
} from './reservation.model';

const API = 'http://localhost:3000/reservations';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private config = inject(APP_CONFIG);
  private notifications = inject(NotificationsService);
  private http = inject(HttpClient);
  private translate = inject(TranslateService);

  private readonly items = signal<Reservation[]>([]);

  readonly reservations = this.items.asReadonly();
  readonly loading = signal(false);
  readonly error = signal('');
  readonly statusFilter = signal<StatusFilter>('all');

  readonly visibleReservations = computed(() => {
    const filter = this.statusFilter();
    return filter === 'all'
      ? this.items()
      : this.items().filter((r) => r.status === filter);
  });

  readonly confirmedCount = computed(
    () => this.items().filter((r) => r.status === 'confirmed').length
  );

  readonly revenue = computed(() =>
    this.items()
      .filter((r) => r.status === 'confirmed')
      .reduce(
        (sum, r) => sum + nightsBetween(r.checkIn, r.checkOut) * r.pricePerNight,
        0
      )
  );

  readonly occupancy = computed(() => {
    const total = this.config.totalRooms;
    return total === 0 ? 0 : Math.min(100, (this.confirmedCount() / total) * 100);
  });

  constructor() {
    this.loadAll();
  }

  private t(key: string, params?: Record<string, string>) {
    return this.translate.instant(key, params);
  }

  loadAll() {
    this.loading.set(true);
    this.error.set('');
    this.http.get<Reservation[]>(API).subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t('MESSAGES.SERVER_ERROR'));
        this.loading.set(false);
      },
    });
  }

  addReservation(data: NewReservation) {
    this.http.post<Reservation>(API, data).subscribe({
      next: (created) => {
        this.items.update((list) => [...list, created]);
        this.notifications.show(this.t('MESSAGES.ADDED', { name: created.guest }));
      },
      error: () => this.notifications.show(this.t('MESSAGES.ADD_FAILED')),
    });
  }

  setStatus(id: string, status: ReservationStatus) {
    const previous = this.items();
    this.items.update((list) =>
      list.map((r) => (r.id === id ? { ...r, status } : r))
    );

    this.http.patch<Reservation>(`${API}/${id}`, { status }).subscribe({
      next: () =>
        this.notifications.show(
          this.t('MESSAGES.STATUS_CHANGED', { status: this.t('STATUS.' + status) })
        ),
      error: () => {
        this.items.set(previous);
        this.notifications.show(this.t('MESSAGES.CHANGE_FAILED'));
      },
    });
  }

  remove(id: string) {
    const previous = this.items();
    this.items.update((list) => list.filter((r) => r.id !== id));

    this.http.delete(`${API}/${id}`).subscribe({
      next: () => this.notifications.show(this.t('MESSAGES.DELETED')),
      error: () => {
        this.items.set(previous);
        this.notifications.show(this.t('MESSAGES.DELETE_FAILED'));
      },
    });
  }

  clearCancelled() {
    const ids = this.items()
      .filter((r) => r.status === 'cancelled')
      .map((r) => r.id);
    if (ids.length === 0) return;

    const previous = this.items();
    this.items.update((list) => list.filter((r) => r.status !== 'cancelled'));

    forkJoin(ids.map((id) => this.http.delete(`${API}/${id}`))).subscribe({
      next: () => this.notifications.show(this.t('MESSAGES.CLEARED')),
      error: () => {
        this.items.set(previous);
        this.notifications.show(this.t('MESSAGES.CLEAR_FAILED'));
      },
    });
  }
}