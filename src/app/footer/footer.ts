import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer>
      <nav>
        <a routerLink="/rooms">{{ 'NAV.ROOMS' | translate }}</a>
        <a routerLink="/book">{{ 'NAV.BOOK' | translate }}</a>
        <a routerLink="/about">{{ 'NAV.ABOUT' | translate }}</a>
        <a routerLink="/contact">{{ 'NAV.CONTACT' | translate }}</a>
        <a routerLink="/login" class="admin">{{ 'AUTH.LOGIN.TITLE' | translate }}</a>
      </nav>
      <p>© 2026 Hotel Manager · {{ 'FOOTER.TEXT' | translate }}</p>
    </footer>
  `,
  styles: `
    footer {
      background: #1a365d;
      color: #cbd5e0;
      text-align: center;
      padding: 1.2rem 1rem;
      margin-top: 2rem;
      font-size: 0.9rem;
    }
    nav { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 0.6rem; flex-wrap: wrap; }
    a { color: #cbd5e0; text-decoration: none; }
    a:hover { color: white; }
    .admin { opacity: 0.7; }
    p { margin: 0; }
  `,
})
export class FooterComponent {}