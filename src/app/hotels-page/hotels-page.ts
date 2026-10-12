import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PropertiesService } from '../properties.service';
import { Property } from '../property.model';

@Component({
  selector: 'app-hotels-page',
  imports: [RouterLink],
  templateUrl: './hotels-page.html',
  styleUrl: './hotels-page.css',
})
export class HotelsPageComponent implements OnInit {
  private service = inject(PropertiesService);

  hotels = signal<Property[]>([]);
  loading = signal(true);
  error = signal(false);
  city = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(false);
    this.service.getAll(this.city().trim()).subscribe({
      next: (data) => {
        this.hotels.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  onCityInput(event: Event) {
    this.city.set((event.target as HTMLInputElement).value);
  }
}