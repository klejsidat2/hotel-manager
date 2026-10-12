import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PropertiesService } from '../properties.service';
import { Room } from '../room.model';

@Component({
  selector: 'app-room-detail',
  imports: [RouterLink],
  template: `
    <section class="page">
      <a routerLink="/rooms" class="back">← Të gjitha dhomat</a>

      @if (loading()) {
        <p>Duke ngarkuar...</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (room(); as r) {
        <div class="layout">
          <div class="gallery">
            @if (mainPhoto(); as main) {
              <img class="main" [src]="main" alt="Dhoma {{ r.number }}" />
              @if (r.photos.length > 1) {
                <div class="thumbs">
                  @for (p of r.photos; track p.id) {
                    <img
                      [src]="p.url"
                      alt="Foto e dhomës"
                      [class.active]="p.url === main"
                      (click)="choose(p.url)"
                    />
                  }
                </div>
              }
            } @else {
              <div class="no-photo">Nuk ka foto për këtë dhomë.</div>
            }
          </div>

          <div class="info">
            <span class="badge">{{ r.type }}</span>
            <h1>Dhoma {{ r.number }}</h1>
            <p class="price">{{ r.pricePerNight }} € <span>/ natë</span></p>

            <h2>Përshkrimi</h2>
            @if (r.description) {
              <p class="desc">{{ r.description }}</p>
            } @else {
              <p class="muted">Ky hotel nuk ka shtuar ende përshkrim për këtë dhomë.</p>
            }

            <a class="btn" routerLink="/book" [queryParams]="{ room: r.id }">
              Rezervo këtë dhomë
            </a>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    .page { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    .back { color: #1a365d; text-decoration: none; font-weight: 600; }
    .layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 2rem; margin-top: 1.2rem; }
    .main { width: 100%; height: 380px; object-fit: cover; border-radius: 8px; display: block; }
    .no-photo { height: 380px; background: #edf2f7; color: #718096; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .thumbs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.7rem; }
    .thumbs img { width: 80px; height: 60px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid transparent; opacity: 0.75; }
    .thumbs img.active { border-color: #1a365d; opacity: 1; }
    .badge { font-size: 0.8rem; background: #eef; padding: 3px 10px; border-radius: 10px; }
    h1 { margin: 0.6rem 0 0.2rem; color: #1a365d; }
    h2 { font-size: 1.05rem; margin: 1.4rem 0 0.4rem; color: #1a365d; }
    .price { font-size: 1.6rem; font-weight: 700; margin: 0; }
    .price span { font-size: 0.95rem; font-weight: 400; color: #666; }
    .desc { white-space: pre-line; line-height: 1.7; color: #2d3748; margin: 0; }
    .muted { color: #718096; margin: 0; }
    .btn { display: inline-block; margin-top: 1.6rem; background: #1a365d; color: white; text-decoration: none; padding: 0.8rem 1.6rem; border-radius: 6px; font-weight: 600; }
    .error { color: #c00; margin-top: 1rem; }
    @media (max-width: 800px) {
      .layout { grid-template-columns: 1fr; }
      .main, .no-photo { height: 260px; }
    }
  `,
})
export class RoomDetailComponent implements OnInit {
  private service = inject(PropertiesService);

  // vjen nga adresa /rooms/:id (withComponentInputBinding)
  id = input.required<string>();

  room = signal<Room | null>(null);
  loading = signal(true);
  error = signal('');
  activePhoto = signal<string | null>(null);

  mainPhoto = computed(() => this.activePhoto() ?? this.room()?.photos[0]?.url ?? null);

  ngOnInit() {
    const id = Number(this.id());
    if (!id) {
      this.error.set('Dhoma nuk u gjet.');
      this.loading.set(false);
      return;
    }

    this.service.getRoom(id).subscribe({
      next: (r) => {
        this.room.set(r);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.status === 404 ? 'Dhoma nuk u gjet.' : 'Nuk u lidh me serverin.');
        this.loading.set(false);
      },
    });
  }

  choose(url: string) {
    this.activePhoto.set(url);
  }
}