import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { HOTEL_ID } from '../hotel.config';
import { PropertiesService } from '../properties.service';
import { RevealDirective } from '../reveal.directive';
import { RoomDescriptionPipe } from '../room-description.pipe';
import { Room } from '../room.model';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, RevealDirective, TranslatePipe, RoomDescriptionPipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePageComponent implements OnInit {
  private service = inject(PropertiesService);

  featured = signal<Room[]>([]);
  heroOk = signal(true);

  ngOnInit() {
    this.service.getRooms(HOTEL_ID).subscribe({
      next: (data) => this.featured.set(data.slice(0, 3)),
      error: () => this.featured.set([]),
    });
  }
}