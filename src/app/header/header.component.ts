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
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem 2rem;
      padding: 1.1rem 2rem;
      background: var(--ink);
      color: #d9cbb6;
      border-bottom: 1px solid var(--gold);
    }
        .brand {
      font-family: var(--font-brand);
      font-size: 1.4rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--gold);
      text-decoration: none;
    }
    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 1.8rem;
    }
    nav a {
      color: #d9cbb6;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.78rem;
      padding-bottom: 0.35rem;
      border-bottom: 2px solid transparent;
      transition: color 0.15s;
    }
    nav a:hover {
      color: var(--gold);
    }
    nav a.active {
      color: var(--gold);
      border-bottom-color: var(--gold);
    }
    .user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }
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