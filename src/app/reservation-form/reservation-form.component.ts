import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  output,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { delay, of } from 'rxjs';

import { APP_CONFIG } from '../app-config.token';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { ControlComponent } from '../control/control.component';
import { NewReservation } from '../reservation.model';
import { ReservationsService } from '../reservations.service';

// Validator i personalizuar: dhoma = 3 shifra
function roomFormat(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  return !value || /^\d{3}$/.test(value) ? null : { roomFormat: true };
}

// Validator për grupin: dalja duhet të jetë pas hyrjes
const datesOrder: ValidatorFn = (group) => {
  const checkIn = group.get('checkIn')?.value;
  const checkOut = group.get('checkOut')?.value;
  return checkIn && checkOut && checkOut <= checkIn ? { datesOrder: true } : null;
};

@Component({
  selector: 'app-reservation-form',
  imports: [ReactiveFormsModule, ButtonComponent, CardComponent, ControlComponent,TranslatePipe],
  templateUrl: './reservation-form.component.html',
  styles: `
    form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.75rem;
      align-items: end;
    }
    .error {
      color: #c53030;
      font-size: 0.8rem;
      font-weight: 400;
    }
    .info {
      color: #718096;
      margin: 0.5rem 0 0;
      font-size: 0.9rem;
    }
    .group-error {
      color: #c53030;
      margin: 0.5rem 0 0;
      font-size: 0.9rem;
    }
  `,
})
export class ReservationFormComponent {
  private config = inject(APP_CONFIG);
  private service = inject(ReservationsService);

  add = output<NewReservation>();
  guestInput = viewChild.required<ElementRef<HTMLInputElement>>('guestInput');

  // Async validator: a është e lirë dhoma në ato data?
  private roomFree: AsyncValidatorFn = (group) => {
    const { room, checkIn, checkOut } = group.value;
    if (!room || !checkIn || !checkOut) return of(null);

    const busy = this.service
      .reservations()
      .some(
        (r) =>
          r.status !== 'cancelled' &&
          r.room === String(room).trim() &&
          checkIn < r.checkOut &&
          checkOut > r.checkIn
      );

    return of(busy ? { roomTaken: true } : null).pipe(delay(400));
  };

  form = new FormGroup(
    {
      guest: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      room: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, roomFormat],
      }),
      checkIn: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      checkOut: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      pricePerNight: new FormControl(this.config.defaultPrice, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
    },
    { validators: [datesOrder], asyncValidators: [this.roomFree] }
  );

  constructor() {
    afterNextRender(() => this.focusGuest());
  }

  onSubmit() {
    if (this.form.pending) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.add.emit({
      ...value,
      guest: value.guest.trim(),
      room: value.room.trim(),
    });

    this.form.reset({
      guest: '',
      room: '',
      checkIn: '',
      checkOut: '',
      pricePerNight: this.config.defaultPrice,
    });
    this.focusGuest();
  }

  private focusGuest() {
    this.guestInput().nativeElement.focus();
  }
}