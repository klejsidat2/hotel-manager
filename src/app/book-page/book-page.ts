import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { HOTEL_ID } from '../hotel.config';
import { PropertiesService } from '../properties.service';
import { Room } from '../room.model';

type GuestField = 'firstName' | 'lastName' | 'email' | 'phone';

@Component({
  selector: 'app-book-page',
  template: `
    <section class="page">
      <h1>Rezervo dhomën tënde</h1>
      <p class="lead">
        Plotëso të dhënat dhe rezervimi regjistrohet menjëherë. Nuk ke nevojë për llogari.
      </p>

      @if (loading()) {
        <p>Duke ngarkuar...</p>
      } @else if (error()) {
        <p class="error">Nuk u lidh me serverin.</p>
      } @else {
        <form (submit)="$event.preventDefault(); book()">
          <label class="wide">
            Dhoma
            <select (change)="onRoom($event)">
              <option value="" [selected]="roomId() === null">Zgjidh një dhomë</option>
              @for (r of rooms(); track r.id) {
                <option [value]="r.id" [selected]="roomId() === r.id">
                  Dhoma {{ r.number }} · {{ r.type }} · {{ r.pricePerNight }} € / natë
                </option>
              }
            </select>
          </label>

          <label>
            Hyrja
            <input type="date" [min]="today" [value]="checkIn()" (input)="onCheckIn($event)" />
          </label>
          <label>
            Dalja
            <input
              type="date"
              [min]="checkIn() || today"
              [value]="checkOut()"
              (input)="onCheckOut($event)"
            />
          </label>

          @if (selectedRoom(); as r) {
            @if (nights() > 0) {
              <p class="summary wide">
                {{ nights() }} net × {{ r.pricePerNight }} € = <strong>{{ total() }} €</strong>
              </p>
            }
          }

          <label>
            Emri
            <input type="text" [value]="guest().firstName" (input)="onGuest('firstName', $event)" />
          </label>
          <label>
            Mbiemri
            <input type="text" [value]="guest().lastName" (input)="onGuest('lastName', $event)" />
          </label>
          <label>
            Email
            <input type="email" [value]="guest().email" (input)="onGuest('email', $event)" />
          </label>
          <label>
            Telefoni
            <input type="tel" [value]="guest().phone" (input)="onGuest('phone', $event)" />
          </label>

          <button type="submit" class="wide">Konfirmo rezervimin</button>
        </form>

        @if (message()) {
          <p [class.error]="messageIsError()" [class.success]="!messageIsError()">
            {{ message() }}
          </p>
        }
      }
    </section>
  `,
  styles: `
    .page { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
    .lead { color: #555; }
    form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: white; padding: 1.2rem; border-radius: 8px; border: 1px solid #ddd; }
    label { display: flex; flex-direction: column; gap: 0.25rem; }
    .wide { grid-column: 1 / -1; }
    input, select { padding: 0.5rem; }
    button { background: #1a365d; color: white; border: none; padding: 0.7rem; border-radius: 6px; cursor: pointer; font-size: 1rem; }
    .summary { margin: 0; background: #f7fafc; padding: 0.7rem; border-radius: 6px; }
    .error { color: #c00; }
    .success { color: #2f855a; font-weight: 600; }
    @media (max-width: 600px) { form { grid-template-columns: 1fr; } }
  `,
})
export class BookPageComponent implements OnInit {
  private service = inject(PropertiesService);

  // vjen nga lidhja /book?room=ID (withComponentInputBinding)
  room = input<string>();

  today = new Date().toISOString().slice(0, 10);

  rooms = signal<Room[]>([]);
  loading = signal(true);
  error = signal(false);

  roomId = signal<number | null>(null);
  checkIn = signal('');
  checkOut = signal('');
  guest = signal({ firstName: '', lastName: '', email: '', phone: '' });
  message = signal('');
  messageIsError = signal(false);

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
        this.error.set(true);
        this.loading.set(false);
      },
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

    if (roomId === null) {
      this.show('Zgjidh një dhomë.', true);
      return;
    }
    if (!this.checkIn() || !this.checkOut()) {
      this.show('Zgjidh datat e hyrjes dhe daljes.', true);
      return;
    }
    if (this.checkOut() <= this.checkIn()) {
      this.show('Data e daljes duhet të jetë pas hyrjes.', true);
      return;
    }
    if (!g.firstName.trim() || !g.lastName.trim()) {
      this.show('Shkruaj emrin dhe mbiemrin.', true);
      return;
    }
    if (!g.email.includes('@') || !g.email.includes('.')) {
      this.show('Shkruaj një email të vlefshëm.', true);
      return;
    }
    if (g.phone.trim().length < 6) {
      this.show('Shkruaj një numër telefoni të vlefshëm.', true);
      return;
    }

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
          this.show(
            `Faleminderit, ${b.guestName}! Rezervimi u regjistrua. Totali: ${b.totalPrice} €`,
            false,
          );
          this.guest.set({ firstName: '', lastName: '', email: '', phone: '' });
          this.checkIn.set('');
          this.checkOut.set('');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.show('Dhoma është e zënë në ato data. Provo data të tjera.', true);
          } else if (err.status === 400) {
            this.show('Të dhënat nuk janë të vlefshme. Kontrollo datat dhe emailin.', true);
          } else {
            this.show('Gabim në server. Provo përsëri.', true);
          }
        },
      });
  }

  private show(text: string, isError: boolean) {
    this.message.set(text);
    this.messageIsError.set(isError);
  }
}