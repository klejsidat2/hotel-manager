import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Booking } from '../booking.model';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-booking-admin',
  template: `
    <section class="admin">
      <h1>Rezervimet</h1>

      <div class="stats">
        <div><span>Gjithsej</span><strong>{{ bookings().length }}</strong></div>
        <div><span>Konfirmuar</span><strong>{{ confirmed() }}</strong></div>
        <div><span>Të ardhura</span><strong>{{ revenue() }} €</strong></div>
      </div>

      @if (loading()) {
        <p>Duke ngarkuar...</p>
      } @else if (error()) {
        <p class="error">Nuk u lidh me serverin. Kontrollo që booking-api po punon.</p>
      } @else if (bookings().length === 0) {
        <p>Nuk ka rezervime ende.</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mysafiri</th>
                <th>Kontakti</th>
                <th>Hoteli / Dhoma</th>
                <th>Datat</th>
                <th>Totali</th>
                <th>Statusi</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              @for (b of bookings(); track b.id) {
                <tr>
                  <td>{{ b.guestName }}</td>
                  <td>{{ b.guestEmail }}<br />{{ b.guestPhone }}</td>
                  <td>{{ b.propertyName }}<br />Dhoma {{ b.roomNumber }}</td>
                  <td>{{ b.checkIn }} → {{ b.checkOut }}</td>
                  <td>{{ b.totalPrice }} €</td>
                  <td>
                    <span class="status" [class]="'status ' + b.status">{{ label(b.status) }}</span>
                  </td>
                  <td class="actions">
                    @if (b.status !== 'CONFIRMED') {
                      <button (click)="change(b, 'CONFIRMED')">Konfirmo</button>
                    }
                    @if (b.status !== 'CANCELLED') {
                      <button (click)="change(b, 'CANCELLED')">Anulo</button>
                    }
                    <button class="danger" (click)="remove(b)">Fshi</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: `
    .admin { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }
    .stats { display: flex; gap: 2rem; margin: 1rem 0 1.5rem; }
    .stats span { display: block; color: #666; font-size: 0.85rem; }
    .stats strong { font-size: 1.5rem; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { text-align: left; padding: 0.6rem 0.8rem; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    th { background: #f7fafc; font-size: 0.85rem; }
    .status { padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; }
    .PENDING { background: #fefcbf; }
    .CONFIRMED { background: #c6f6d5; }
    .CANCELLED { background: #fed7d7; }
    .actions { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .actions button { padding: 0.3rem 0.7rem; cursor: pointer; }
    .danger { color: #c00; }
    .error { color: #c00; }
  `,
})
export class BookingAdminComponent implements OnInit {
  private service = inject(PropertiesService);

  bookings = signal<Booking[]>([]);
  loading = signal(true);
  error = signal(false);

  confirmed = computed(() => this.bookings().filter((b) => b.status === 'CONFIRMED').length);
  revenue = computed(() =>
    this.bookings()
      .filter((b) => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0),
  );

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAllBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  label(status: Booking['status']) {
    return { PENDING: 'Në pritje', CONFIRMED: 'Konfirmuar', CANCELLED: 'Anuluar' }[status];
  }

  change(b: Booking, status: Booking['status']) {
    this.service.setBookingStatus(b.id, status).subscribe({
      next: (updated) =>
        this.bookings.update((list) => list.map((x) => (x.id === updated.id ? updated : x))),
    });
  }

  remove(b: Booking) {
    if (!confirm(`Të fshihet rezervimi i ${b.guestName}?`)) return;
    this.service.deleteBooking(b.id).subscribe({
      next: () => this.bookings.update((list) => list.filter((x) => x.id !== b.id)),
    });
  }
}