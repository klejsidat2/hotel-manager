import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { RevealDirective } from '../reveal.directive';

@Component({
  selector: 'app-about-page',
  imports: [TranslatePipe, RevealDirective],
  template: `
    <section class="page">
      <header class="head" appReveal>
        <p class="kicker">{{ 'PAGE_ABOUT.KICKER' | translate }}</p>
        <h1>{{ 'PAGE_ABOUT.TITLE' | translate }}</h1>
        <span class="rule"></span>
        <p class="lead">{{ 'PAGE_ABOUT.LEAD' | translate }}</p>
      </header>

      <div class="mission" appReveal>
        <h2>{{ 'PAGE_ABOUT.MISSION_TITLE' | translate }}</h2>
        <p>{{ 'PAGE_ABOUT.MISSION_TEXT' | translate }}</p>
      </div>

      <div class="block">
        <h2 class="center" appReveal>{{ 'PAGE_ABOUT.VALUES_TITLE' | translate }}</h2>
        <div class="cards">
          @for (v of values; track v; let i = $index) {
            <div appReveal [style.--reveal-delay]="i * 0.12 + 's'">
              <div class="card">
                <span class="num">0{{ v }}</span>
                <h3>{{ 'PAGE_ABOUT.V' + v + '_TITLE' | translate }}</h3>
                <p>{{ 'PAGE_ABOUT.V' + v + '_TEXT' | translate }}</p>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="services" appReveal>
        <h2>{{ 'PAGE_ABOUT.SERVICES_TITLE' | translate }}</h2>
        <ul>
          @for (s of services; track s) {
            <li>{{ 'PAGE_ABOUT.S' + s | translate }}</li>
          }
        </ul>
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
      margin-bottom: 3.2rem;
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
      max-width: 620px;
      margin: 0 auto;
      color: var(--muted);
      line-height: 1.8;
      font-size: 1.05rem;
    }

    .mission {
      max-width: 720px;
      margin: 0 auto 4rem;
      padding: 2rem 2.2rem;
      background: var(--paper);
      border: 1px solid var(--line);
      border-left: 3px solid var(--gold);
      border-radius: 4px;
    }
    .mission h2 {
      margin: 0 0 0.8rem;
      font-size: 1.5rem;
    }
    .mission p {
      margin: 0;
      line-height: 1.9;
    }

    .block {
      margin-bottom: 4rem;
    }
    h2.center {
      margin: 0 0 2rem;
      text-align: center;
      font-size: 1.8rem;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.6rem;
    }
    .card {
      height: 100%;
      padding: 1.8rem;
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
    .num {
      font-family: var(--font-title);
      font-size: 1.9rem;
      color: var(--gold);
    }
    .card h3 {
      margin: 0.3rem 0 0.5rem;
      font-size: 1.3rem;
    }
    .card p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .services {
      max-width: 720px;
      margin: 0 auto 2rem;
    }
    .services h2 {
      margin: 0 0 1.2rem;
      font-size: 1.5rem;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      position: relative;
      padding: 0.85rem 0 0.85rem 1.8rem;
      border-bottom: 1px solid var(--line);
    }
    li::before {
      content: '◆';
      position: absolute;
      left: 0;
      top: 0.95rem;
      font-size: 0.6rem;
      color: var(--gold);
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }
    }
  `,
})
export class AboutPageComponent {
  values = ['1', '2', '3'];
  services = ['1', '2', '3', '4'];
}