import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../auth.service';
import { ButtonComponent } from '../button/button.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  imports: [
    ButtonComponent,
    LanguageSwitcherComponent,
    TranslatePipe,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <header>
      <a routerLink="/home" class="brand">Hotel NewInn</a>

      <nav>
        @if (auth.role() === 'admin') {
          <a routerLink="/admin/reservations" routerLinkActive="active">
            {{ 'NAV.ADMIN' | translate }}
          </a>
          <a routerLink="/admin/rooms" routerLinkActive="active">
            {{ 'NAV.ADMIN_ROOMS' | translate }}
          </a>
        } @else {
          <a routerLink="/home" routerLinkActive="active">{{ 'NAV.HOME' | translate }}</a>
          <a routerLink="/rooms" routerLinkActive="active">{{ 'NAV.ROOMS' | translate }}</a>
          <a routerLink="/book" routerLinkActive="active">{{ 'NAV.BOOK' | translate }}</a>
          <a routerLink="/about" routerLinkActive="active">{{ 'NAV.ABOUT' | translate }}</a>
          <a routerLink="/contact" routerLinkActive="active">{{ 'NAV.CONTACT' | translate }}</a>
        }
      </nav>

      <div class="user">
        <app-language-switcher />

        @if (auth.currentUser(); as user) {
          <span>
            {{ user.name }} ·
            <strong>{{ auth.role() }}</strong>
          </span>
          <button appButton class="secondary" (click)="logout()">
            {{ 'COMMON.LOGOUT' | translate }}
          </button>
        }
      </div>
    </header>
  `,
  styles: `
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1a365d;
      color: white;
      padding: 1rem 1.5rem;
    }
    .brand {
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
    }
    nav { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    nav a {
      color: #cbd5e0;
      text-decoration: none;
      padding-bottom: 0.25rem;
    }
    nav a.active {
      color: white;
      border-bottom: 2px solid white;
    }
    .user { display: flex; align-items: center; gap: 0.75rem; }
  `,
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}