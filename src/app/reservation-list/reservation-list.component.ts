import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ReservationItemComponent } from '../reservation-item/reservation-item.component';
import { StatusFilter } from '../reservation.model';
import { ReservationsService } from '../reservations.service';
import { StatusFilterComponent } from '../status-filter/status-filter.component';

const PAGE_SIZE = 5;
const STATUSES = ['pending', 'confirmed', 'cancelled'];

@Component({
  selector: 'app-reservation-list',
  imports: [
    FormsModule,
    ButtonComponent,
    CardComponent,
    ReservationItemComponent,
    StatusFilterComponent,
    PaginationComponent,
    TranslatePipe,
  ],
  templateUrl: './reservation-list.component.html',
  styles: `
    .toolbar {
      display: flex;
      gap: 1rem;
      align-items: end;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
      font-weight: 600;
    }
    input {
      padding: 0.45rem 0.6rem;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      font: inherit;
      font-weight: 400;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .empty {
      color: #718096;
    }
    .error {
      color: #c53030;
    }
  `,
})
export class ReservationListComponent {
  service = inject(ReservationsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // query params si signal: përditësohet sa herë ndryshon URL-ja
  private params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  q = computed(() => this.params().get('q') ?? '');
  status = computed<StatusFilter>(() => {
    const s = this.params().get('status') ?? '';
    return STATUSES.includes(s) ? (s as StatusFilter) : 'all';
  });
  page = computed(() => Math.max(1, Number(this.params().get('page')) || 1));

  // ajo që shkruhet te kutia; URL-ja përditësohet pas 300ms
  search = signal(this.route.snapshot.queryParamMap.get('q') ?? '');

  constructor() {
    toObservable(this.search)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((v) => v !== this.q()),
        takeUntilDestroyed()
      )
      .subscribe((v) => this.update({ q: v || null, page: null }));

    // kur URL-ja ndryshon (p.sh. me Back), kutia e kërkimit ndjek
    effect(() => this.search.set(this.q()));
  }

  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const status = this.status();
    return this.service
      .reservations()
      .filter((r) => status === 'all' || r.status === status)
      .filter((r) => r.guest.toLowerCase().includes(q) || r.room.toLowerCase().includes(q))
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  currentPage = computed(() => Math.min(this.page(), this.totalPages()));
  pageItems = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  setStatus(value: StatusFilter) {
    this.update({ status: value === 'all' ? null : value, page: null });
  }

  goToPage(p: number) {
    this.update({ page: p === 1 ? null : p });
  }

  // null e heq parametrin nga URL-ja; 'merge' ruan të tjerët
  private update(queryParams: Record<string, string | number | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}