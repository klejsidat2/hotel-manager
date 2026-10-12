import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './auth.service';
import { FooterComponent } from './footer/footer';
import { HeaderComponent } from './header/header.component';
import { LanguageService } from './language.service';
import { ToastComponent } from './toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
})
export class App {
  private language = inject(LanguageService);
  auth = inject(AuthService);
}