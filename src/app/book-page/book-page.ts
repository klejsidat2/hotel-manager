import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { Booking } from '../booking.model';
import { HOTEL_ID } from '../hotel.config';
import { LanguageService } from '../language.service';
import { PropertiesService } from '../properties.service';
import { Room } from '../room.model';

type GuestField = 'firstName' | 'lastName' | 'email' | 'phone';

const EMPTY_GUEST = { firstName: '', lastName: '', email: '', phone: '' };

function localToday(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

@Component({
  selector: 'app-book-page',
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="page">
      <header class="head">
        <p class="kicker">{{ 'PAGE_BOOK.KICKER' | translate }}</p>
        <h1>{{ 'PAGE_BOOK.TITLE' | translate }}</h1>
        <span class="rule"></span>
        <p class="lead">{{ 'PAGE_BOOK.LEAD' | translate }}</p>
      </header>

      @if (loading()) {
        <p class="state">{{ 'PAGE_BOOK.LOADING' | translate }}</p>
      } @else if (loadError()) {
        <p class="state error">{{ 'PAGE_BOOK.ERROR_LOAD' | translate }}</p>
      } @else if (done(); as b) {
        <div class="done">
          <span class="check">✓</span>
          <h2>{{ 'PAGE_BOOK.DONE_TITLE' | translate }}</h2>
          <p class="done-text">{{ 'PAGE_BOOK.DONE_TEXT' | translate }}</p>

          <dl>
            <div>
              <dt>{{ 'PAGE_BOOK.DONE_ROOM' | translate }}</dt>
              <dd>{{ 'ROOM.NUMBER' | translate: { number: b.roomNumber } }}</dd>
            </div>
            <div>
              <dt>{{ 'PAGE_BOOK.DONE_DATES' | translate }}</dt>
              <dd>{{ fmt(b.checkIn) }} → {{ fmt(b.checkOut) }}</dd>
            </div>
            <div>
              <dt>{{ 'PAGE_BOOK.DONE_GUEST' | translate }}</dt>
              <dd>{{ b.guestName }}</dd>
            </div>
            <div>
              <dt>{{ 'PAGE_BOOK.DONE_TOTAL' | translate }}</dt>
              <dd class="gold">{{ b.totalPrice }} €</dd>
            </div>
            <div>
              <dt>{{ 'PAGE_BOOK.DONE_STATUS' | translate }}</dt>
              <dd>{{ 'PAGE_BOOK.DONE_PENDING' | translate }}</dd>
            </div>
          </dl>

          <div class="done-actions">
            <button type="button" class="btn" (click)="done.set(null)">
              {{ 'PAGE_BOOK.DONE_AGAIN' | translate }}
            </button>
            <a routerLink="/home" class="btn ghost">{{ 'PAGE_BOOK.DONE_HOME' | translate }}</a>
          </div>
        </div>
      } @else {
        <div class="layout">
          <form class="form" (submit)="$event.preventDefault(); book()">
            <h2>{{ 'PAGE_BOOK.STAY' | translate }}</h2>

            <label class="wide">
              <span>{{ 'PAGE_BOOK.ROOM' | translate }}</span>
              <select (change)="onRoom($event)">
                <option value="" [selected]="roomId() === null">
                  {{ 'PAGE_BOOK.ROOM_PLACEHOLDER' | translate }}
                </option>
                @for (r of rooms(); track r.id) {
                  <option [value]="r.id" [selected]="roomId() === r.id">
                    {{ 'ROOM.NUMBER' | translate: { number: r.number } }} ·
                    {{ 'ROOM_TYPE.' + r.type | translate }} · {{ r.pricePerNight }} €
                    {{ 'ROOM.PER_NIGHT' | translate }}
                  </option>
                }
              </select>
            </label>

            <label>
              <span>{{ 'PAGE_BOOK.CHECK_IN' | translate }}</span>
              <input type="date" [min]="today" [value]="checkIn()" (input)="onCheckIn($event)" />
            </label>
            <label>
              <span>{{ 'PAGE_BOOK.CHECK_OUT' | translate }}</span>
              <input
                type="date"
                [min]="checkIn() || today"
                [value]="checkOut()"
                (input)="onCheckOut($event)"
              />
            </label>

            <h2 class="second">{{ 'PAGE_BOOK.GUEST' | translate }}</h2>

            <label>
              <span>{{ 'PAGE_BOOK.FIRST_NAME' | translate }}</span>
              <input
                type="text"
                autocomplete="given-name"
                [value]="guest().firstName"
                (input)="onGuest('firstName', $event)"
              />
            </label>
            <label>
              <span>{{ 'PAGE_BOOK.LAST_NAME' | translate }}</span>
              <input
                type="text"
                autocomplete="family-name"
                [value]="guest().lastName"
                (input)="onGuest('lastName', $event)"
              />
            </label>
            <label>
              <span>{{ 'PAGE_BOOK.EMAIL' | translate }}</span>
              <input
                type="email"
                autocomplete="email"
                [value]="guest().email"
                (input)="onGuest('email', $event)"
              />
            </label>
            <label>
              <span>{{ 'PAGE_BOOK.PHONE' | translate }}</span>
              <input
                type="tel"
                autocomplete="tel"
                [value]="guest().phone"
                (input)="onGuest('phone', $event)"
              />
            </label>

            @if (error()) {
              <p class="msg wide">{{ 'PAGE_BOOK.ERR_' + error() | translate }}</p>
            }

            <button type="submit" class="submit wide" [disabled]="sending()">
              {{ (sending() ? 'PAGE_BOOK.SENDING' : 'PAGE_BOOK.SUBMIT') | translate }}
            </button>
            <p class="note wide">{{ 'PAGE_BOOK.NOTE' | translate }}</p>
          </form>

          <aside class="summary">
            <h2>{{ 'PAGE_BOOK.SUMMARY' | translate }}</h2>

            @if (selectedRoom(); as r) {
              @if (r.photos.length > 0) {
                <img [src]="r.photos[0].url" [alt]="'ROOM.NUMBER' | translate: { number: r.number }" />
              }
              <span class="type">{{ 'ROOM_TYPE.' + r.type | translate }}</span>
              <p class="room-name">{{ 'ROOM.NUMBER' | translate: { number: r.number } }}</p>
              <p class="rate">
                {{ r.pricePerNight }} € <span>{{ 'ROOM.PER_NIGHT' | translate }}</span>
              </p>

              @if (nights() > 0) {
                <div class="calc">
                  <span>
                    {{ nights() }}
                    {{ (nights() === 1 ? 'PAGE_BOOK.NIGHT' : 'PAGE_BOOK.NIGHTS') | translate }}
                    × {{ r.pricePerNight }} €
                  </span>
                </div>
                <div class="total">
                  <span>{{ 'PAGE_BOOK.TOTAL' | translate }}</span>
                  <strong>{{ total() }} €</strong>
                </div>
              }
            } @else {
              <p class="empty">{{ 'PAGE_BOOK.SUMMARY_EMPTY' | translate }}</p>
            }
          </aside>
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem 1rem;
    }
    .head {
      text-align: center;
      margin-bottom: 2.6rem;
    }
    .kicker {
      margin: 0 0 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      font-size: 0.72rem;
      color: var(--gold-dark);
    }
    h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.9rem);
    }
    .rule {
      display: block;
      width: 56px;
      height: 2px;
      margin: 1.2rem auto;
      background: var(--gold);
    }
    .lead {
      max-width: 560px;
      margin: 0 auto;
      color: var(--muted);
      line-height: 1.7;
    }
    .state {
      padding: 3rem 0;
      text-align: center;
      color: var(--muted);
    }
    .state.error {
      color: #9b2c2c;
    }

    .layout {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.1rem 1.2rem;
      padding: 2rem;
      background: var(--paper);
      border: 1px solid var(--line);
      border-top: 3px solid var(--gold);
      border-radius: 6px;
    }
    .form h2,
    .summary h2 {
      grid-column: 1 / -1;
      margin: 0;
      font-size: 1.35rem;
    }
    .form h2.second {
      margin-top: 0.8rem;
    }
    .wide {
      grid-column: 1 / -1;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    label span {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--muted);
    }
    input,
    select {
      padding: 0.75rem 0.85rem;
      border: 1px solid var(--line);
      border-radius: 3px;
      background: #fff;
      color: var(--text);
      font: inherit;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
    }
    input:focus,
    select:focus {
      outline: none;
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201, 162, 74, 0.2);
    }
    .msg {
      margin: 0;
      padding: 0.8rem 1rem;
      border-left: 3px solid #9b2c2c;
      background: #fbeeee;
      color: #7b2222;
      font-size: 0.92rem;
    }
    .submit {
      padding: 1rem;
      border: none;
      border-radius: 2px;
      background: var(--gold);
      color: var(--ink);
      font: inherit;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 0.82rem;
      cursor: pointer;
      transition:
        background 0.2s,
        transform 0.2s;
    }
    .submit:hover:not(:disabled) {
      background: #dbb55c;
      transform: translateY(-2px);
    }
    .submit:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    .note {
      margin: 0;
      text-align: center;
      font-size: 0.85rem;
      color: var(--muted);
    }

    .summary {
      position: sticky;
      top: 6rem;
      padding: 1.6rem;
      background: var(--ink-soft);
      color: #d9cbb6;
      border-radius: 6px;
    }
    .summary h2 {
      color: var(--gold);
      margin-bottom: 1rem;
    }
    .summary img {
      display: block;
      width: 100%;
      height: 170px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .type {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--gold);
    }
    .room-name {
      margin: 0.3rem 0;
      font-family: var(--font-title);
      font-size: 1.5rem;
      color: #fff6e6;
    }
    .rate {
      margin: 0;
      font-size: 1.1rem;
      color: #fff6e6;
    }
    .rate span {
      font-size: 0.85rem;
      color: #b8a890;
    }
    .calc {
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(201, 162, 74, 0.3);
      font-size: 0.95rem;
    }
    .total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 0.6rem;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }
    .total strong {
      font-family: var(--font-title);
      font-size: 1.9rem;
      letter-spacing: 0;
      color: var(--gold);
    }
    .empty {
      margin: 0;
      color: #b8a890;
      line-height: 1.6;
    }

    .done {
      max-width: 560px;
      margin: 0 auto;
      padding: 2.4rem 2rem;
      text-align: center;
      background: var(--paper);
      border: 1px solid var(--line);
      border-top: 3px solid var(--gold);
      border-radius: 6px;
      animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    }
    .check {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border: 2px solid var(--gold);
      border-radius: 50%;
      font-size: 1.8rem;
      color: var(--gold-dark);
    }
    .done h2 {
      margin: 1rem 0 0.4rem;
      font-size: 1.8rem;
    }
    .done-text {
      margin: 0 0 1.6rem;
      color: var(--muted);
      line-height: 1.7;
    }
    dl {
      margin: 0 0 1.8rem;
      text-align: left;
    }
    dl div {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.7rem 0;
      border-bottom: 1px solid var(--line);
    }
    dt {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--muted);
    }
    dd {
      margin: 0;
      font-weight: 500;
      text-align: right;
    }
    dd.gold {
      font-weight: 700;
      color: var(--gold-dark);
    }
    .done-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.8rem;
    }
    .btn {
      padding: 0.85rem 1.6rem;
      border: 1px solid var(--gold);
      border-radius: 2px;
      background: var(--gold);
      color: var(--ink);
      font: inherit;
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      text-decoration: none;
      cursor: pointer;
    }
    .btn.ghost {
      background: transparent;
      color: var(--ink);
    }

    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @media (max-width: 860px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .summary {
        position: static;
        order: -1;
      }
      .form {
        grid-template-columns: 1fr;
        padding: 1.4rem;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .done {
        animation: none;
      }
    }
  `,
})
export class BookPageComponent implements OnInit {
  private service = inject(PropertiesService);
  private language = inject(LanguageService);

  // vjen nga lidhja /book?room=ID (withComponentInputBinding)
  room = input<string>();

  today = localToday();

  rooms = signal<Room[]>([]);
  loading = signal(true);
  loadError = signal(false);

  roomId = signal<number | null>(null);
  checkIn = signal('');
  checkOut = signal('');
  guest = signal({ ...EMPTY_GUEST });

  // çelësi i gabimit (p.sh. 'TAKEN' → PAGE_BOOK.ERR_TAKEN), përkthehet te template
  error = signal('');
  sending = signal(false);
  done = signal<Booking | null>(null);

  selectedRoom = computed(() => this.rooms().find((r) => r.id === this.roomId()) ?? null);

  nights = computed(() => {
    const a = this.checkIn();
    const b = this.checkOut();
    if (!a || !b) return 0;
    const diff = (new Date(b).getTime() - new Date(a).getTime()) / 86400000;
    return diff > 0 ? Math.round(diff) : 0;
  });

  total = computed(() => {
    const r = this.selectedRoom();
    return r ? r.pricePerNight * this.nights() : 0;
  });

  ngOnInit() {
    this.service.getRooms(HOTEL_ID).subscribe({
      next: (data) => {
        this.rooms.set(data);
        const wanted = Number(this.room());
        if (wanted && data.some((r) => r.id === wanted)) {
          this.roomId.set(wanted);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  // datë e lexueshme sipas gjuhës aktive
  fmt(iso: string): string {
    const locale = this.language.current().lang === 'en' ? 'en-GB' : 'sq-AL';
    return new Date(iso + 'T00:00:00').toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  onRoom(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.roomId.set(value ? Number(value) : null);
  }

  onCheckIn(e: Event) {
    this.checkIn.set((e.target as HTMLInputElement).value);
  }

  onCheckOut(e: Event) {
    this.checkOut.set((e.target as HTMLInputElement).value);
  }

  onGuest(field: GuestField, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.guest.update((g) => ({ ...g, [field]: value }));
  }

  book() {
    const roomId = this.roomId();
    const g = this.guest();

    if (roomId === null) return this.fail('ROOM');
    if (!this.checkIn() || !this.checkOut()) return this.fail('DATES');
    if (this.checkIn() < this.today) return this.fail('PAST');
    if (this.checkOut() <= this.checkIn()) return this.fail('ORDER');
    if (!g.firstName.trim() || !g.lastName.trim()) return this.fail('NAME');
    if (!g.email.includes('@') || !g.email.includes('.')) return this.fail('EMAIL');
    if (g.phone.trim().length < 6) return this.fail('PHONE');

    this.error.set('');
    this.sending.set(true);

    this.service
      .createBooking({
        roomId,
        checkIn: this.checkIn(),
        checkOut: this.checkOut(),
        firstName: g.firstName.trim(),
        lastName: g.lastName.trim(),
        email: g.email.trim(),
        phone: g.phone.trim(),
      })
      .subscribe({
        next: (b) => {
          this.sending.set(false);
          this.done.set(b);
          this.guest.set({ ...EMPTY_GUEST });
          this.checkIn.set('');
          this.checkOut.set('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err: HttpErrorResponse) => {
          this.sending.set(false);
          this.error.set(err.status === 409 ? 'TAKEN' : err.status === 400 ? 'INVALID' : 'SERVER');
        },
      });
  }

  private fail(key: string): void {
    this.error.set(key);
  }
}