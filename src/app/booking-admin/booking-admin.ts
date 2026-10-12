import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Booking } from '../booking.model';
import { LanguageService } from '../language.service';
import { PropertiesService } from '../properties.service';

type Filter = 'ALL' | Booking['status'];

@Component({
  selector: 'app-booking-admin',
  imports: [TranslatePipe],
  template: `
    <section class="page">
      <header class="head">
        <h1>{{ 'PAGE_ADMIN_BOOKINGS.TITLE' | translate }}</h1>
        <span class="rule"></span>
      </header>

      <div class="stats">
        <div class="stat">
          <span>{{ 'PAGE_ADMIN_BOOKINGS.STAT_TOTAL' | translate }}</span>
          <strong>{{ bookings().length }}</strong>
        </div>
        <div class="stat">
          <span>{{ 'PAGE_ADMIN_BOOKINGS.STAT_PENDING' | translate }}</span>
          <strong>{{ count('PENDING') }}</strong>
        </div>
        <div class="stat">
          <span>{{ 'PAGE_ADMIN_BOOKINGS.STAT_CONFIRMED' | translate }}</span>
          <strong>{{ count('CONFIRMED') }}</strong>
        </div>
        <div class="stat dark">
          <span>{{ 'PAGE_ADMIN_BOOKINGS.STAT_REVENUE' | translate }}</span>
          <strong>{{ revenue() }} €</strong>
        </div>
      </div>

      <div class="toolbar">
        <div class="chips">
          @for (f of filters; track f) {
            <button
              type="button"
              class="chip"
              [class.active]="filter() === f"
              (click)="filter.set(f)"
            >
              {{ statusKey(f) | translate }} <small>{{ count(f) }}</small>
            </button>
          }
        </div>
        <input
          type="search"
          class="search"
          [placeholder]="'PAGE_ADMIN_BOOKINGS.SEARCH' | translate"
          [value]="query()"
          (input)="onQuery($event)"
        />
      </div>

      @if (msg()) {
        <p class="msg">{{ 'PAGE_ADMIN_BOOKINGS.' + msg() | translate }}</p>
      }

      @if (loading()) {
        <p class="state">{{ 'PAGE_ADMIN_BOOKINGS.LOADING' | translate }}</p>
      } @else if (loadError()) {
        <p class="state error">{{ 'PAGE_ADMIN_BOOKINGS.ERROR_LOAD' | translate }}</p>
      } @else if (bookings().length === 0) {
        <p class="state">{{ 'PAGE_ADMIN_BOOKINGS.EMPTY' | translate }}</p>
      } @else if (visible().length === 0) {
        <p class="state">{{ 'PAGE_ADMIN_BOOKINGS.NO_RESULTS' | translate }}</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ 'PAGE_ADMIN_BOOKINGS.TH_GUEST' | translate }}</th>
                <th>{{ 'PAGE_ADMIN_BOOKINGS.TH_CONTACT' | translate }}</th>
                <th>{{ 'PAGE_ADMIN_BOOKINGS.TH_ROOM' | translate }}</th>
                <th>{{ 'PAGE_ADMIN_BOOKINGS.TH_DATES' | translate }}</th>
                <th>{{ 'PAGE_ADMIN_BOOKINGS.TH_TOTAL' | translate }}</th>
                <th>{{ 'PAGE_ADMIN_BOOKINGS.TH_STATUS' | translate }}</th>
                <th>{{ 'PAGE_ADMIN_BOOKINGS.TH_ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              @for (b of visible(); track b.id) {
                <tr>
                  <td class="strong">{{ b.guestName }}</td>
                  <td>
                    {{ b.guestEmail }}<br />
                    <span class="muted">{{ b.guestPhone }}</span>
                  </td>
                  <td>
                    {{ 'ROOM.NUMBER' | translate: { number: b.roomNumber } }}<br />
                    <span class="muted">{{ b.propertyName }}</span>
                  </td>
                  <td class="nowrap">{{ fmt(b.checkIn) }} → {{ fmt(b.checkOut) }}</td>
                  <td class="strong gold">{{ b.totalPrice }} €</td>
                  <td>
                    <span class="status" [attr.data-status]="b.status">
                      {{ statusKey(b.status) | translate }}
                    </span>
                  </td>
                  <td>
                    <div class="actions">
                      @if (b.status !== 'CONFIRMED') {
                        <button type="button" class="act primary" (click)="change(b, 'CONFIRMED')">
                          {{ 'PAGE_ADMIN_BOOKINGS.CONFIRM' | translate }}
                        </button>
                      }
                      @if (b.status !== 'CANCELLED') {
                        <button type="button" class="act" (click)="change(b, 'CANCELLED')">
                          {{ 'PAGE_ADMIN_BOOKINGS.CANCEL' | translate }}
                        </button>
                      }
                      <button type="button" class="act danger" (click)="remove(b)">
                        {{ 'PAGE_ADMIN_BOOKINGS.DELETE' | translate }}
                      </button>
                    </div>
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
    :host {
      display: block;
    }
    .page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem 1rem;
    }
    .head {
      margin-bottom: 2rem;
    }
    h1 {
      margin: 0;
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    }
    .rule {
      display: block;
      width: 56px;
      height: 2px;
      margin-top: 1rem;
      background: var(--gold);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat {
      padding: 1.2rem 1.4rem;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 6px;
    }
    .stat span {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--muted);
    }
    .stat strong {
      display: block;
      margin-top: 0.4rem;
      font-family: var(--font-title);
      font-size: 2rem;
      color: var(--text);
    }
    .stat.dark {
      background: var(--ink-soft);
      border-color: var(--ink-soft);
    }
    .stat.dark span {
      color: #b8a890;
    }
    .stat.dark strong {
      color: var(--gold);
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.2rem;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .chip {
      padding: 0.5rem 1rem;
      border: 1px solid var(--line);
      border-radius: 2px;
      background: var(--paper);
      color: var(--text);
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
      transition:
        background 0.2s,
        border-color 0.2s;
    }
    .chip small {
      margin-left: 0.3rem;
      color: var(--muted);
    }
    .chip:hover {
      border-color: var(--gold);
    }
    .chip.active {
      background: var(--ink);
      border-color: var(--ink);
      color: var(--gold);
    }
    .chip.active small {
      color: #b8a890;
    }
    .search {
      width: min(100%, 340px);
      padding: 0.6rem 0.85rem;
      border: 1px solid var(--line);
      border-radius: 3px;
      background: #fff;
      font: inherit;
      font-size: 0.9rem;
    }
    .search:focus {
      outline: none;
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201, 162, 74, 0.2);
    }

    .msg {
      margin: 0 0 1rem;
      padding: 0.8rem 1rem;
      border-left: 3px solid #9b2c2c;
      background: #fbeeee;
      color: #7b2222;
      font-size: 0.92rem;
    }
    .state {
      padding: 3rem 0;
      text-align: center;
      color: var(--muted);
    }
    .state.error {
      color: #9b2c2c;
    }

    .table-wrap {
      overflow-x: auto;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
    }
    th {
      padding: 0.9rem 1rem;
      text-align: left;
      white-space: nowrap;
      background: var(--ink-soft);
      color: var(--gold);
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }
    td {
      padding: 0.95rem 1rem;
      border-top: 1px solid var(--line);
      vertical-align: top;
    }
    tbody tr {
      transition: background 0.2s;
    }
    tbody tr:hover {
      background: #faf3e6;
    }
    .strong {
      font-weight: 600;
    }
    .gold {
      color: var(--gold-dark);
    }
    .muted {
      color: var(--muted);
      font-size: 0.85rem;
    }
    .nowrap {
      white-space: nowrap;
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.7rem;
      border-radius: 2px;
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      white-space: nowrap;
    }
    .status[data-status='PENDING'] {
      background: #f6e7bd;
      color: #7a5a10;
    }
    .status[data-status='CONFIRMED'] {
      background: #d9ead3;
      color: #2d5a22;
    }
    .status[data-status='CANCELLED'] {
      background: #f1d6d3;
      color: #7b2a22;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .act {
      padding: 0.4rem 0.8rem;
      border: 1px solid var(--line);
      border-radius: 2px;
      background: #fff;
      color: var(--text);
      font: inherit;
      font-size: 0.78rem;
      cursor: pointer;
      transition:
        background 0.2s,
        border-color 0.2s;
    }
    .act:hover {
      border-color: var(--gold);
    }
    .act.primary {
      background: var(--gold);
      border-color: var(--gold);
      color: var(--ink);
      font-weight: 600;
    }
    .act.primary:hover {
      background: #dbb55c;
    }
    .act.danger {
      color: #9b2c2c;
    }
    .act.danger:hover {
      background: #fbeeee;
      border-color: #9b2c2c;
    }
  `,
})
export class BookingAdminComponent implements OnInit {
  private service = inject(PropertiesService);
  private translate = inject(TranslateService);
  private language = inject(LanguageService);

  filters: Filter[] = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'];

  bookings = signal<Booking[]>([]);
  loading = signal(true);
  loadError = signal(false);
  filter = signal<Filter>('ALL');
  query = signal('');
  // çelësi i mesazhit të gabimit (p.sh. 'ERR_STATUS'), përkthehet te template
  msg = signal('');

  revenue = computed(() => {
    const sum = this.bookings()
      .filter((b) => b.status === 'CONFIRMED')
      .reduce((total, b) => total + Number(b.totalPrice), 0);
    return Math.round(sum * 100) / 100;
  });

  visible = computed(() => {
    const f = this.filter();
    const q = this.query().trim().toLowerCase();
    return this.bookings().filter((b) => {
      if (f !== 'ALL' && b.status !== f) return false;
      if (!q) return true;
      return (
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.guestPhone.toLowerCase().includes(q)
      );
    });
  });

  ngOnInit() {
    this.service.getAllBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  count(f: Filter): number {
    return f === 'ALL'
      ? this.bookings().length
      : this.bookings().filter((b) => b.status === f).length;
  }

  // përdor çelësat ekzistues STATUS.all, STATUS.pending, STATUS.confirmed, STATUS.cancelled
  statusKey(f: Filter): string {
    return 'STATUS.' + f.toLowerCase();
  }

  // datë e lexueshme sipas gjuhës aktive
  fmt(iso: string): string {
    const locale = this.language.current().lang === 'en' ? 'en-GB' : 'sq-AL';
    return new Date(iso + 'T00:00:00').toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  onQuery(e: Event) {
    this.query.set((e.target as HTMLInputElement).value);
  }

  change(b: Booking, status: Booking['status']) {
    this.msg.set('');
    this.service.setBookingStatus(b.id, status).subscribe({
      next: (updated) =>
        this.bookings.update((list) => list.map((x) => (x.id === updated.id ? updated : x))),
      error: () => this.msg.set('ERR_STATUS'),
    });
  }

  remove(b: Booking) {
    const question = this.translate.instant('PAGE_ADMIN_BOOKINGS.CONFIRM_DELETE', {
      name: b.guestName,
    });
    if (!confirm(question)) return;

    this.msg.set('');
    this.service.deleteBooking(b.id).subscribe({
      next: () => this.bookings.update((list) => list.filter((x) => x.id !== b.id)),
      error: () => this.msg.set('ERR_DELETE'),
    });
  }
}