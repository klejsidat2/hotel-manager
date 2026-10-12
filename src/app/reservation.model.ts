export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
export type StatusFilter = 'all' | ReservationStatus;

export interface Reservation {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  pricePerNight: number;
  status: ReservationStatus;
}

export type NewReservation = Omit<Reservation, 'id' | 'status'>;

export interface StatusChange {
  id: string;
  status: ReservationStatus;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}