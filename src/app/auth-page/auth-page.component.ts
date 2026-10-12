import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-auth-page',
  imports: [RouterOutlet, LanguageSwitcherComponent],
  templateUrl: './auth-page.component.html',
  styles: `
    :host {
      display: block;
      max-width: 420px;
      margin: 3rem auto;
      padding: 0 1rem;
    }
    h1 {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .lang {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }
  `,
})
export class AuthPageComponent {}