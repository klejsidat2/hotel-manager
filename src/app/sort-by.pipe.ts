import { Pipe, PipeTransform } from '@angular/core';

import { Reservation } from './reservation.model';

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortByPipe implements PipeTransform {
  transform(
    value: Reservation[],
    field: 'guest' | 'checkIn' | 'room' = 'checkIn',
    direction: 'asc' | 'desc' = 'asc'
  ): Reservation[] {
    const sorted = [...value].sort((a, b) => a[field].localeCompare(b[field]));
    return direction === 'asc' ? sorted : sorted.reverse();
  }
}