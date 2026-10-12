import { Pipe, PipeTransform } from '@angular/core';

import { ReservationStatus } from './reservation.model';

@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: ReservationStatus): string {
    switch (value) {
      case 'pending':
        return 'Në pritje';
      case 'confirmed':
        return 'Konfirmuar';
      case 'cancelled':
        return 'Anuluar';
    }
  }
}