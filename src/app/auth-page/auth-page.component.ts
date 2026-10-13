import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [RouterOutlet],
  templateUrl: './auth-page.component.html',
  styles: `
    :host {
      display: block;
      padding: 4rem 1rem 3rem;
    }
    .card {
      max-width: 440px;
      margin: 0 auto;
      padding: 2.4rem 2.2rem 2.2rem;
      background: var(--paper);
      border: 1px solid var(--line);
      border-top: 3px solid var(--gold);
      border-radius: 6px;
      box-shadow: 0 24px 50px rgba(28, 20, 16, 0.12);
      animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    }
    .brand {
      margin: 0;
      text-align: center;
      font-family: var(--font-brand, Georgia, serif);
      font-size: 1.4rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--gold-dark);
    }
    .rule {
      display: block;
      width: 48px;
      height: 2px;
      margin: 1rem auto 1.6rem;
      background: var(--gold);
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card {
        animation: none;
      }
    }
  `,
})
export class AuthPageComponent {}