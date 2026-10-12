import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { HOTEL_ID } from '../hotel.config';
import { PropertiesService } from '../properties.service';
import { RoomDescriptionPipe } from '../room-description.pipe';
import { Room } from '../room.model';

type FormField = 'number' | 'type' | 'price' | 'description' | 'descriptionEn';
type Msg = { key: string; error: boolean };

const EMPTY_FORM = {
  number: '',
  type: 'DOUBLE' as Room['type'],
  price: '',
  description: '',
  descriptionEn: '',
};

@Component({
  selector: 'app-rooms-admin',
  imports: [TranslatePipe, RoomDescriptionPipe],
  template: `
    <section class="page">
      <header class="head">
        <h1>{{ 'PAGE_ADMIN_ROOMS.TITLE' | translate }}</h1>
        <span class="rule"></span>
      </header>

      <form class="form" (submit)="$event.preventDefault(); save()">
        <h2>
          {{ (editingId() === null ? 'PAGE_ADMIN_ROOMS.NEW_ROOM' : 'PAGE_ADMIN_ROOMS.EDIT_ROOM') | translate }}
        </h2>

        <label>
          <span>{{ 'PAGE_ADMIN_ROOMS.NUMBER' | translate }}</span>
          <input type="text" [value]="form().number" (input)="onField('number', $event)" />
        </label>

        <label>
          <span>{{ 'PAGE_ADMIN_ROOMS.TYPE' | translate }}</span>
          <select (change)="onField('type', $event)">
            <option value="SINGLE" [selected]="form().type === 'SINGLE'">
              {{ 'ROOM_TYPE.SINGLE' | translate }}
            </option>
            <option value="DOUBLE" [selected]="form().type === 'DOUBLE'">
              {{ 'ROOM_TYPE.DOUBLE' | translate }}
            </option>
            <option value="SUITE" [selected]="form().type === 'SUITE'">
              {{ 'ROOM_TYPE.SUITE' | translate }}
            </option>
          </select>
        </label>

        <label>
          <span>{{ 'PAGE_ADMIN_ROOMS.PRICE' | translate }}</span>
          <input
            type="number"
            min="1"
            [value]="form().price"
            (input)="onField('price', $event)"
          />
        </label>

        <label class="wide">
          <span>{{ 'PAGE_ADMIN_ROOMS.DESC_SQ' | translate }}</span>
          <textarea
            rows="3"
            [value]="form().description"
            (input)="onField('description', $event)"
          ></textarea>
        </label>

        <label class="wide">
          <span>{{ 'PAGE_ADMIN_ROOMS.DESC_EN' | translate }}</span>
          <textarea
            rows="3"
            [value]="form().descriptionEn"
            (input)="onField('descriptionEn', $event)"
          ></textarea>
          <small>{{ 'PAGE_ADMIN_ROOMS.DESC_HINT' | translate }}</small>
        </label>

        <div class="buttons wide">
          <button type="submit" class="btn">
            {{ (editingId() === null ? 'PAGE_ADMIN_ROOMS.ADD' : 'PAGE_ADMIN_ROOMS.SAVE') | translate }}
          </button>
          @if (editingId() !== null) {
            <button type="button" class="btn ghost" (click)="cancelEdit()">
              {{ 'PAGE_ADMIN_ROOMS.CANCEL' | translate }}
            </button>
          }
        </div>
      </form>

      @if (msg(); as m) {
        <p class="msg" [class.error]="m.error">{{ 'PAGE_ADMIN_ROOMS.' + m.key | translate }}</p>
      }

      @if (rooms().length === 0) {
        <p class="state">{{ 'PAGE_ADMIN_ROOMS.EMPTY' | translate }}</p>
      } @else {
        <div class="grid">
          @for (r of rooms(); track r.id) {
            <article class="card">
              <div class="head-row">
                <span class="type">{{ 'ROOM_TYPE.' + r.type | translate }}</span>
                <span class="price">{{ r.pricePerNight }} €</span>
              </div>
              <h3>{{ 'ROOM.NUMBER' | translate: { number: r.number } }}</h3>

              @if (r | roomDescription; as desc) {
                <p class="desc">{{ desc }}</p>
              }
              @if (!r.descriptionEn) {
                <span class="warn">{{ 'PAGE_ADMIN_ROOMS.NO_EN' | translate }}</span>
              }

              <div class="photos">
                @for (p of r.photos; track p.id) {
                  <div class="photo">
                    <img [src]="p.url" alt="" />
                    <button
                      type="button"
                      [title]="'PAGE_ADMIN_ROOMS.DELETE_PHOTO' | translate"
                      (click)="removePhoto(r, p.id)"
                    >
                      ×
                    </button>
                  </div>
                }
              </div>

              <label class="upload">
                <span>{{ 'PAGE_ADMIN_ROOMS.ADD_PHOTOS' | translate }}</span>
                <input type="file" accept="image/*" multiple (change)="upload(r, $event)" />
              </label>

              <div class="buttons">
                <button type="button" class="act" (click)="edit(r)">
                  {{ 'PAGE_ADMIN_ROOMS.EDIT' | translate }}
                </button>
                <button type="button" class="act danger" (click)="remove(r)">
                  {{ 'PAGE_ADMIN_ROOMS.DELETE' | translate }}
                </button>
              </div>
            </article>
          }
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
      padding: 3rem 1.5rem 1rem;
    }
    .head {
      margin-bottom: 2rem;
    }
    h1 {
      margin: 0;
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    }
    .rule {
      display: block;
      width: 56px;
      height: 2px;
      margin-top: 1rem;
      background: var(--gold);
    }

    .form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.1rem 1.2rem;
      margin-bottom: 1.4rem;
      padding: 1.8rem;
      background: var(--paper);
      border: 1px solid var(--line);
      border-top: 3px solid var(--gold);
      border-radius: 6px;
    }
    .form h2 {
      grid-column: 1 / -1;
      margin: 0;
      font-size: 1.35rem;
    }
    .wide {
      grid-column: 1 / -1;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    label > span {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--muted);
    }
    label small {
      color: var(--muted);
      font-size: 0.8rem;
    }
    input,
    select,
    textarea {
      padding: 0.7rem 0.85rem;
      border: 1px solid var(--line);
      border-radius: 3px;
      background: #fff;
      color: var(--text);
      font: inherit;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
    }
    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201, 162, 74, 0.2);
    }
    textarea {
      resize: vertical;
    }

    .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    .btn {
      padding: 0.8rem 1.6rem;
      border: 1px solid var(--gold);
      border-radius: 2px;
      background: var(--gold);
      color: var(--ink);
      font: inherit;
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #dbb55c;
    }
    .btn.ghost {
      background: transparent;
      color: var(--text);
    }

    .msg {
      margin: 0 0 1.4rem;
      padding: 0.8rem 1rem;
      border-left: 3px solid #2d5a22;
      background: #eaf3e6;
      color: #2d5a22;
      font-size: 0.92rem;
    }
    .msg.error {
      border-left-color: #9b2c2c;
      background: #fbeeee;
      color: #7b2222;
    }
    .state {
      padding: 3rem 0;
      text-align: center;
      color: var(--muted);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 1.4rem;
    }
    .card {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 1.4rem;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 6px;
      transition:
        transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1),
        box-shadow 0.25s,
        border-color 0.25s;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: var(--gold);
      box-shadow: 0 14px 30px rgba(28, 20, 16, 0.12);
    }
    .head-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .type {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--gold-dark);
    }
    .price {
      font-weight: 600;
      color: var(--gold-dark);
    }
    .card h3 {
      margin: 0;
      font-size: 1.35rem;
    }
    .desc {
      margin: 0;
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.6;
      white-space: pre-line;
    }
    .warn {
      align-self: flex-start;
      padding: 0.15rem 0.5rem;
      border-radius: 2px;
      background: #f6e7bd;
      color: #7a5a10;
      font-size: 0.72rem;
    }

    .photos {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    .photo {
      position: relative;
    }
    .photo img {
      display: block;
      width: 92px;
      height: 70px;
      object-fit: cover;
      border-radius: 4px;
    }
    .photo button {
      position: absolute;
      top: -7px;
      right: -7px;
      width: 22px;
      height: 22px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: #9b2c2c;
      color: #fff;
      line-height: 1;
      cursor: pointer;
    }
    .upload input {
      padding: 0.5rem;
      font-size: 0.85rem;
    }

    .act {
      padding: 0.45rem 1rem;
      border: 1px solid var(--line);
      border-radius: 2px;
      background: #fff;
      color: var(--text);
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
      transition:
        background 0.2s,
        border-color 0.2s;
    }
    .act:hover {
      border-color: var(--gold);
    }
    .act.danger {
      color: #9b2c2c;
    }
    .act.danger:hover {
      background: #fbeeee;
      border-color: #9b2c2c;
    }
  `,
})
export class RoomsAdminComponent implements OnInit {
  private service = inject(PropertiesService);
  private translate = inject(TranslateService);

  rooms = signal<Room[]>([]);
  editingId = signal<number | null>(null);
  form = signal({ ...EMPTY_FORM });
  msg = signal<Msg | null>(null);

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.service.getRooms(HOTEL_ID).subscribe({
      next: (data) => this.rooms.set(data),
      error: () => this.show('ERROR_LOAD', true),
    });
  }

  onField(field: FormField, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  save() {
    const f = this.form();
    const price = Number(f.price);

    if (!f.number.trim()) return this.show('ERR_NUMBER', true);
    if (!price || price <= 0) return this.show('ERR_PRICE', true);

    const payload = {
      number: f.number.trim(),
      type: f.type,
      pricePerNight: price,
      description: f.description.trim(),
      descriptionEn: f.descriptionEn.trim(),
      propertyId: HOTEL_ID,
    };

    const editing = this.editingId();
    const request =
      editing === null
        ? this.service.createRoom(payload)
        : this.service.updateRoom(editing, payload);

    request.subscribe({
      next: () => {
        this.show(editing === null ? 'OK_ADDED' : 'OK_SAVED', false);
        this.cancelEdit();
        this.loadRooms();
      },
      error: () => this.show('ERR_SAVE', true),
    });
  }

  edit(r: Room) {
    this.editingId.set(r.id);
    this.form.set({
      number: r.number,
      type: r.type,
      price: String(r.pricePerNight),
      description: r.description ?? '',
      descriptionEn: r.descriptionEn ?? '',
    });
    this.msg.set(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
  }

  remove(r: Room) {
    const question = this.translate.instant('PAGE_ADMIN_ROOMS.CONFIRM_DELETE', {
      number: r.number,
    });
    if (!confirm(question)) return;

    this.service.deleteRoom(r.id).subscribe({
      next: () => {
        this.rooms.update((list) => list.filter((x) => x.id !== r.id));
        this.show('OK_DELETED', false);
      },
      error: (err: HttpErrorResponse) =>
        this.show(err.status === 409 ? 'ERR_DELETE_BOOKINGS' : 'ERR_DELETE', true),
    });
  }

  upload(r: Room, e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    this.service.uploadPhotos(r.id, files).subscribe({
      next: (updated) => {
        this.replace(updated);
        this.show('OK_PHOTOS', false);
        input.value = '';
      },
      error: (err: HttpErrorResponse) => {
        this.show(
          err.status === 413 ? 'ERR_TOO_LARGE' : err.status === 400 ? 'ERR_BAD_TYPE' : 'ERR_UPLOAD',
          true,
        );
        input.value = '';
      },
    });
  }

  removePhoto(r: Room, photoId: number) {
    this.service.deletePhoto(r.id, photoId).subscribe({
      next: (updated) => this.replace(updated),
      error: () => this.show('ERR_PHOTO_DELETE', true),
    });
  }

  private replace(updated: Room) {
    this.rooms.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
  }

  private show(key: string, error: boolean) {
    this.msg.set({ key, error });
  }
}