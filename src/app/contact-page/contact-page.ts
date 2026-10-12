import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { RevealDirective } from '../reveal.directive';

@Component({
  selector: 'app-contact-page',
  imports: [TranslatePipe, RevealDirective],
  template: `
    <section class="page">
      <header class="head" appReveal>
        <p class="kicker">{{ 'PAGE_CONTACT.KICKER' | translate }}</p>
        <h1>{{ 'PAGE_CONTACT.TITLE' | translate }}</h1>
        <span class="rule"></span>
        <p class="lead">{{ 'PAGE_CONTACT.LEAD' | translate }}</p>
      </header>

      <div class="cards">
        <div appReveal style="--reveal-delay: 0s">
          <div class="card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <h3>{{ 'PAGE_CONTACT.ADDRESS' | translate }}</h3>
            <p>{{ 'PAGE_CONTACT.ADDRESS_VALUE' | translate }}</p>
          </div>
        </div>

        <div appReveal style="--reveal-delay: 0.12s">
          <div class="card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path
                d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
              />
            </svg>
            <h3>{{ 'PAGE_CONTACT.PHONE' | translate }}</h3>
            <p>
              <a [href]="'tel:' + phoneHref">{{ phone }}</a>
            </p>
          </div>
        </div>

        <div appReveal style="--reveal-delay: 0.24s">
          <div class="card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <h3>{{ 'PAGE_CONTACT.EMAIL' | translate }}</h3>
            <p>
              <a [href]="'mailto:' + email">{{ email }}</a>
            </p>
          </div>
        </div>

        <div appReveal style="--reveal-delay: 0.36s">
          <div class="card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <h3>{{ 'PAGE_CONTACT.HOURS' | translate }}</h3>
            <p>{{ 'PAGE_CONTACT.HOURS_VALUE' | translate }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem 1rem;
    }
    .head {
      text-align: center;
      margin-bottom: 3rem;
    }
    .kicker {
      margin: 0 0 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      font-size: 0.72rem;
      color: var(--gold-dark);
    }
    h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.9rem);
    }
    .rule {
      display: block;
      width: 56px;
      height: 2px;
      margin: 1.2rem auto;
      background: var(--gold);
    }
    .lead {
      max-width: 560px;
      margin: 0 auto;
      color: var(--muted);
      line-height: 1.8;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.6rem;
    }
    .card {
      height: 100%;
      padding: 2rem 1.6rem;
      text-align: center;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 6px;
      opacity: 0.85;
      transition:
        transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1),
        box-shadow 0.3s,
        opacity 0.3s,
        border-color 0.3s;
    }
    .card:hover {
      opacity: 1;
      transform: translateY(-6px) scale(1.03);
      border-color: var(--gold);
      box-shadow: 0 18px 38px rgba(28, 20, 16, 0.16);
    }
    svg {
      width: 34px;
      height: 34px;
      color: var(--gold-dark);
    }
    .card h3 {
      margin: 0.9rem 0 0.4rem;
      font-size: 1.15rem;
    }
    .card p {
      margin: 0;
      color: var(--muted);
      line-height: 1.6;
    }
    .card a {
      color: var(--ink);
      text-decoration: none;
      border-bottom: 1px solid var(--gold);
    }
    .card a:hover {
      color: var(--gold-dark);
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }
    }
  `,
})
export class ContactPageComponent {
  // të dhëna shembull: zëvendësoji me ato të vërtetat
  phone = '+355 69 000 0000';
  phoneHref = '+355690000000';
  email = 'info@hotelnewinn.al';
}