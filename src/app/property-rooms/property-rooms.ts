import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOTEL_ID } from '../hotel.config';
import { PropertiesService } from '../properties.service';
import { Room } from '../room.model';

@Component({
  selector: 'app-property-rooms',
  imports: [RouterLink],
  templateUrl: './property-rooms.html',
  styleUrl: './property-rooms.css',
})
export class PropertyRoomsComponent implements OnInit {
  private service = inject(PropertiesService);

  rooms = signal<Room[]>([]);
  loading = signal(true);
  error = signal(false);

  ngOnInit() {
    this.service.getRooms(HOTEL_ID).subscribe({
      next: (data) => {
        this.rooms.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}