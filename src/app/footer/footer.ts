import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer>
      <p class="brand">Hotel NewInn</p>
      <nav>
        <a routerLink="/rooms">{{ 'NAV.ROOMS' | translate }}</a>
        <a routerLink="/book">{{ 'NAV.BOOK' | translate }}</a>
        <a routerLink="/about">{{ 'NAV.ABOUT' | translate }}</a>
        <a routerLink="/contact">{{ 'NAV.CONTACT' | translate }}</a>
        <a routerLink="/login" class="admin">{{ 'AUTH.LOGIN.TITLE' | translate }}</a>
      </nav>
      <p class="copy">© 2026 Hotel NewInn · {{ 'FOOTER.TEXT' | translate }}</p>
    </footer>
  `,
  styles: `
    footer {
      margin-top: 3rem;
      padding: 2.2rem 1rem 1.6rem;
      text-align: center;
      background: var(--ink);
      color: #b8a890;
      border-top: 1px solid var(--gold);
    }
        .brand {
      margin: 0 0 1rem;
      font-family: var(--font-brand);
      font-size: 1.3rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--gold);
    }
    nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.4rem 1.8rem;
      margin-bottom: 1.2rem;
    }
    a {
      color: #d9cbb6;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.75rem;
    }
    a:hover {
      color: var(--gold);
    }
    .admin {
      opacity: 0.6;
    }
    .copy {
      margin: 0;
      font-size: 0.8rem;
    }
  `,
})
export class FooterComponent {}