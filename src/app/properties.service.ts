import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Booking, NewBooking } from './booking.model';
import { Property } from './property.model';
import { Room, RoomPayload } from './room.model';

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  getAll(city?: string) {
    return this.http.get<Property[]>(`${this.base}/properties`, {
      params: city ? { city } : {},
    });
  }

  getRooms(propertyId: number) {
    return this.http.get<Room[]>(`${this.base}/rooms`, {
      params: { propertyId },
    });
  }

  getRoom(id: number) {
    return this.http.get<Room>(`${this.base}/rooms/${id}`);
  }

  createRoom(room: RoomPayload) {
    return this.http.post<Room>(`${this.base}/rooms`, room);
  }

  updateRoom(id: number, room: RoomPayload) {
    return this.http.put<Room>(`${this.base}/rooms/${id}`, room);
  }

  deleteRoom(id: number) {
    return this.http.delete<void>(`${this.base}/rooms/${id}`);
  }

  uploadPhotos(roomId: number, files: File[]) {
    const data = new FormData();
    files.forEach((f) => data.append('files', f));
    return this.http.post<Room>(`${this.base}/rooms/${roomId}/photos`, data);
  }

  deletePhoto(roomId: number, photoId: number) {
    return this.http.delete<Room>(`${this.base}/rooms/${roomId}/photos/${photoId}`);
  }

  createBooking(booking: NewBooking) {
    return this.http.post<Booking>(`${this.base}/bookings`, booking);
  }

  getAllBookings() {
    return this.http.get<Booking[]>(`${this.base}/bookings`);
  }

  setBookingStatus(id: number, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    return this.http.patch<Booking>(`${this.base}/bookings/${id}/status`, { status });
  }

  deleteBooking(id: number) {
    return this.http.delete<void>(`${this.base}/bookings/${id}`);
  }
}