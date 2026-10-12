import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { HOTEL_ID } from '../hotel.config';
import { PropertiesService } from '../properties.service';
import { RevealDirective } from '../reveal.directive';
import { RoomDescriptionPipe } from '../room-description.pipe';
import { Room } from '../room.model';

@Component({
  selector: 'app-property-rooms',
  imports: [RouterLink, TranslatePipe, RevealDirective, RoomDescriptionPipe],
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