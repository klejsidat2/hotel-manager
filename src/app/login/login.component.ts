import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../auth.service';
import { ButtonComponent } from '../button/button.component';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TranslatePipe, ControlComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.router.navigate([user.role === 'admin' ? '/admin/reservations' : '/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(
          err.status === 401
            ? 'Email ose fjalëkalim i gabuar.'
            : err.status === 0
              ? 'Nuk u lidh me serverin. Kontrollo që booking-api po punon.'
              : 'Hyrja dështoi. Provo përsëri.',
        );
      },
    });
  }
}