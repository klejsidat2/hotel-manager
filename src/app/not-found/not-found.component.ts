import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslatePipe],
  template: `
    <section>
      <h1>404</h1>
      <p>{{ 'NOT_FOUND.MESSAGE' | translate }}</p>
      <a routerLink="/reservations">{{ 'NOT_FOUND.BACK' | translate }}</a>
    </section>
  `,
  styles: `
    section {
      text-align: center;
      margin: 4rem auto;
      padding: 0 1rem;
    }
    h1 {
      font-size: 4rem;
      margin: 0;
      color: #1a365d;
    }
    a {
      color: #2b6cb0;
    }
  `,
})
export class NotFoundComponent {}