import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOTEL_ID } from '../hotel.config';
import { PropertiesService } from '../properties.service';
import { Room } from '../room.model';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePageComponent implements OnInit {
  private service = inject(PropertiesService);
  featured = signal<Room[]>([]);

  ngOnInit() {
    this.service.getRooms(HOTEL_ID).subscribe({
      next: (data) => this.featured.set(data.slice(0, 3)),
      error: () => this.featured.set([]),
    });
  }
}