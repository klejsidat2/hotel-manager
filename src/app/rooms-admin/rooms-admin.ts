import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { HOTEL_ID } from '../hotel.config';
import { PropertiesService } from '../properties.service';
import { Room } from '../room.model';

type FormField = 'number' | 'type' | 'price' | 'description';

@Component({
  selector: 'app-rooms-admin',
  template: `
    <section class="admin">
      <h1>Menaxho dhomat</h1>

      <form class="form" (submit)="$event.preventDefault(); save()">
        <h2>{{ editingId() === null ? 'Dhomë e re' : 'Ndrysho dhomën' }}</h2>

        <label>
          Numri
          <input type="text" [value]="form().number" (input)="onField('number', $event)" />
        </label>

        <label>
          Lloji
          <select (change)="onField('type', $event)">
            <option value="SINGLE" [selected]="form().type === 'SINGLE'">SINGLE</option>
            <option value="DOUBLE" [selected]="form().type === 'DOUBLE'">DOUBLE</option>
            <option value="SUITE" [selected]="form().type === 'SUITE'">SUITE</option>
          </select>
        </label>

        <label>
          Çmimi / natë (€)
          <input type="number" min="1" [value]="form().price" (input)="onField('price', $event)" />
        </label>

        <label class="wide">
          Përshkrimi
          <textarea
            rows="3"
            [value]="form().description"
            (input)="onField('description', $event)"
          ></textarea>
        </label>

        <div class="buttons wide">
          <button type="submit">
            {{ editingId() === null ? 'Shto dhomën' : 'Ruaj ndryshimet' }}
          </button>
          @if (editingId() !== null) {
            <button type="button" (click)="cancelEdit()">Anulo</button>
          }
        </div>
      </form>

      @if (message()) {
        <p [class.error]="messageIsError()" [class.success]="!messageIsError()">{{ message() }}</p>
      }

      @if (rooms().length === 0) {
        <p>Nuk ka dhoma ende.</p>
      } @else {
        <div class="grid">
          @for (r of rooms(); track r.id) {
            <article class="card">
              <div class="head">
                <span class="badge">{{ r.type }}</span>
                <strong>Dhoma {{ r.number }}</strong>
                <span>{{ r.pricePerNight }} €</span>
              </div>

              @if (r.description) {
                <p class="desc">{{ r.description }}</p>
              }

              <div class="photos">
                @for (p of r.photos; track p.id) {
                  <div class="photo">
                    <img [src]="p.url" alt="Foto e dhomës" />
                    <button type="button" title="Fshi foton" (click)="removePhoto(r, p.id)">
                      ×
                    </button>
                  </div>
                }
              </div>

              <label class="upload">
                Shto foto
                <input type="file" accept="image/*" multiple (change)="upload(r, $event)" />
              </label>

              <div class="buttons">
                <button type="button" (click)="edit(r)">Ndrysho</button>
                <button type="button" class="danger" (click)="remove(r)">Fshi</button>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .admin { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    .form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .form h2 { grid-column: 1 / -1; margin: 0; }
    .form label { display: flex; flex-direction: column; gap: 0.25rem; }
    .wide { grid-column: 1 / -1; }
    .buttons { display: flex; gap: 0.5rem; }
    button { padding: 0.4rem 0.9rem; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .head { display: flex; gap: 0.6rem; align-items: center; }
    .badge { font-size: 0.75rem; background: #eef; padding: 2px 8px; border-radius: 10px; }
    .desc { color: #555; margin: 0; }
    .photos { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .photo { position: relative; }
    .photo img { width: 90px; height: 70px; object-fit: cover; border-radius: 6px; display: block; }
    .photo button { position: absolute; top: -6px; right: -6px; border-radius: 50%; padding: 0 6px; background: #c00; color: white; border: none; }
    .upload { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem; }
    .danger { color: #c00; }
    .error { color: #c00; }
    .success { color: #2f855a; font-weight: 600; }
  `,
})
export class RoomsAdminComponent implements OnInit {
  private service = inject(PropertiesService);

  rooms = signal<Room[]>([]);

  editingId = signal<number | null>(null);
  form = signal<{ number: string; type: Room['type']; price: string; description: string }>({
    number: '',
    type: 'DOUBLE',
    price: '',
    description: '',
  });

  message = signal('');
  messageIsError = signal(false);

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.service.getRooms(HOTEL_ID).subscribe({
      next: (data) => this.rooms.set(data),
      error: () => this.show('Dhomat nuk u ngarkuan. Kontrollo që booking-api po punon.', true),
    });
  }

  onField(field: FormField, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  save() {
    const f = this.form();
    const price = Number(f.price);

    if (!f.number.trim()) {
      this.show('Shkruaj numrin e dhomës.', true);
      return;
    }
    if (!price || price <= 0) {
      this.show('Çmimi duhet të jetë më i madh se 0.', true);
      return;
    }

    const payload = {
      number: f.number.trim(),
      type: f.type,
      pricePerNight: price,
      description: f.description.trim(),
      propertyId: HOTEL_ID,
    };

    const editing = this.editingId();
    const request =
      editing === null
        ? this.service.createRoom(payload)
        : this.service.updateRoom(editing, payload);

    request.subscribe({
      next: () => {
        this.show(editing === null ? 'Dhoma u shtua.' : 'Ndryshimet u ruajtën.', false);
        this.cancelEdit();
        this.loadRooms();
      },
      error: () => this.show('Ruajtja dështoi. Kontrollo të dhënat.', true),
    });
  }

  edit(r: Room) {
    this.editingId.set(r.id);
    this.form.set({
      number: r.number,
      type: r.type,
      price: String(r.pricePerNight),
      description: r.description ?? '',
    });
    this.message.set('');
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.set({ number: '', type: 'DOUBLE', price: '', description: '' });
  }

  remove(r: Room) {
    if (!confirm(`Të fshihet dhoma ${r.number}?`)) return;
    this.service.deleteRoom(r.id).subscribe({
      next: () => {
        this.rooms.update((list) => list.filter((x) => x.id !== r.id));
        this.show('Dhoma u fshi.', false);
      },
      error: (err: HttpErrorResponse) =>
        this.show(
          err.status === 409
            ? 'Dhoma ka rezervime dhe nuk mund të fshihet.'
            : 'Fshirja dështoi.',
          true,
        ),
    });
  }

  upload(r: Room, e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    this.service.uploadPhotos(r.id, files).subscribe({
      next: (updated) => {
        this.replace(updated);
        this.show('Fotot u ngarkuan.', false);
        input.value = '';
      },
      error: (err: HttpErrorResponse) => {
        const text =
          err.status === 413
            ? 'Fotoja është shumë e madhe (maksimumi 10 MB).'
            : err.status === 400
              ? 'Lejohen vetëm foto: jpg, png, webp, gif.'
              : 'Ngarkimi dështoi.';
        this.show(text, true);
        input.value = '';
      },
    });
  }

  removePhoto(r: Room, photoId: number) {
    this.service.deletePhoto(r.id, photoId).subscribe({
      next: (updated) => this.replace(updated),
      error: () => this.show('Fshirja e fotos dështoi.', true),
    });
  }

  private replace(updated: Room) {
    this.rooms.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
  }

  private show(text: string, isError: boolean) {
    this.message.set(text);
    this.messageIsError.set(isError);
  }
}