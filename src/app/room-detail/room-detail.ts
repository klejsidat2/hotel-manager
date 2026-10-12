import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PropertiesService } from '../properties.service';
import { RoomDescriptionPipe } from '../room-description.pipe';
import { Room } from '../room.model';

@Component({
  selector: 'app-room-detail',
  imports: [RouterLink, TranslatePipe, RoomDescriptionPipe],
  template: `
    <section class="page">
      <a routerLink="/rooms" class="back">← {{ 'PAGE_ROOM.BACK' | translate }}</a>

      @if (loading()) {
        <p class="state">{{ 'PAGE_ROOM.LOADING' | translate }}</p>
      } @else if (error()) {
        <p class="state error">{{ 'PAGE_ROOM.ERR_' + error() | translate }}</p>
      } @else if (room(); as r) {
        <div class="layout">
          <div class="gallery">
            <div class="stage">
              @if (mainPhoto(); as main) {
                @for (u of [main]; track u) {
                  <img
                    [src]="u"
                    [alt]="'ROOM.NUMBER' | translate: { number: r.number }"
                  />
                }
              } @else {
                <div class="nophoto">{{ 'PAGE_ROOM.NO_PHOTOS' | translate }}</div>
              }
            </div>

            @if (r.photos.length > 1) {
              <div class="thumbs">
                @for (p of r.photos; track p.id) {
                  <button
                    type="button"
                    [class.active]="p.url === mainPhoto()"
                    (click)="choose(p.url)"
                  >
                    <img [src]="p.url" alt="" />
                  </button>
                }
              </div>
            }
          </div>

          <div class="info">
            <span class="type">{{ 'ROOM_TYPE.' + r.type | translate }}</span>
            <h1>{{ 'ROOM.NUMBER' | translate: { number: r.number } }}</h1>
            <span class="rule"></span>
            <p class="price">
              {{ r.pricePerNight }} € <span>{{ 'ROOM.PER_NIGHT' | translate }}</span>
            </p>

            <h2>{{ 'PAGE_ROOM.DESCRIPTION' | translate }}</h2>
            @if (r | roomDescription; as desc) {
              <p class="desc">{{ desc }}</p>
            } @else {
              <p class="muted">{{ 'PAGE_ROOM.NO_DESCRIPTION' | translate }}</p>
            }

            <a class="btn" routerLink="/book" [queryParams]="{ room: r.id }">
              {{ 'PAGE_ROOM.BOOK' | translate }}
            </a>
            <p class="note">{{ 'PAGE_ROOM.NOTE' | translate }}</p>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 1rem;
    }
    .back {
      display: inline-block;
      margin-bottom: 1.8rem;
      color: var(--gold-dark);
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .back:hover {
      color: var(--ink);
    }
    .state {
      padding: 3rem 0;
      text-align: center;
      color: var(--muted);
    }
    .state.error {
      color: #9b2c2c;
    }

    .layout {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .stage {
      height: 460px;
      overflow: hidden;
      border-radius: 6px;
      background: #efe6d8;
      box-shadow: 0 18px 40px rgba(28, 20, 16, 0.15);
    }
    .stage img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: fade 0.6s ease both;
      transition: transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    .stage:hover img {
      transform: scale(1.05);
    }
    .nophoto {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--muted);
    }

    .thumbs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 0.9rem;
    }
    .thumbs button {
      padding: 0;
      overflow: hidden;
      border: 2px solid transparent;
      border-radius: 4px;
      background: none;
      cursor: pointer;
      opacity: 0.6;
      transition:
        opacity 0.2s,
        transform 0.2s,
        border-color 0.2s;
    }
    .thumbs button:hover {
      opacity: 1;
      transform: translateY(-2px);
    }
    .thumbs button.active {
      border-color: var(--gold);
      opacity: 1;
    }
    .thumbs img {
      display: block;
      width: 84px;
      height: 62px;
      object-fit: cover;
    }

    .type {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: var(--gold-dark);
    }
    h1 {
      margin: 0.4rem 0 0;
      font-size: clamp(2rem, 4vw, 2.8rem);
    }
    .rule {
      display: block;
      width: 48px;
      height: 2px;
      margin: 1rem 0 1.4rem;
      background: var(--gold);
    }
    .price {
      margin: 0;
      font-family: var(--font-title);
      font-size: 2.2rem;
      color: var(--gold-dark);
    }
    .price span {
      font-family: var(--font-body);
      font-size: 0.9rem;
      color: var(--muted);
    }
    h2 {
      margin: 2rem 0 0.6rem;
      font-family: var(--font-body);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
    }
    .desc {
      margin: 0;
      white-space: pre-line;
      line-height: 1.8;
    }
    .muted {
      margin: 0;
      color: var(--muted);
    }
    .btn {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.95rem 2.2rem;
      border-radius: 2px;
      background: var(--gold);
      color: var(--ink);
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 0.8rem;
      font-weight: 600;
      transition:
        background 0.2s,
        transform 0.2s;
    }
    .btn:hover {
      background: #dbb55c;
      transform: translateY(-2px);
    }
    .note {
      margin: 0.9rem 0 0;
      font-size: 0.85rem;
      color: var(--muted);
    }

    @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @media (max-width: 860px) {
      .layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .stage {
        height: 300px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .stage img {
        animation: none;
        transition: none;
      }
    }
  `,
})
export class RoomDetailComponent implements OnInit {
  private service = inject(PropertiesService);

  // vjen nga adresa /rooms/:id (withComponentInputBinding)
  id = input.required<string>();

  room = signal<Room | null>(null);
  loading = signal(true);
  error = signal<'' | 'NOT_FOUND' | 'SERVER'>('');
  activePhoto = signal<string | null>(null);

  mainPhoto = computed(() => this.activePhoto() ?? this.room()?.photos[0]?.url ?? null);

  ngOnInit() {
    const id = Number(this.id());
    if (!id) {
      this.error.set('NOT_FOUND');
      this.loading.set(false);
      return;
    }

    this.service.getRoom(id).subscribe({
      next: (r) => {
        this.room.set(r);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.status === 404 ? 'NOT_FOUND' : 'SERVER');
        this.loading.set(false);
      },
    });
  }

  choose(url: string) {
    this.activePhoto.set(url);
  }
}