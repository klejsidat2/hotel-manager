import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

// Lejon hyrjen vetëm nëse je i loguar, përndryshe të çon te /login
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

// Faqja e hyrjes: nëse je tashmë i loguar, të çon te paneli
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree([auth.role() === 'admin' ? '/admin/reservations' : '/home']);
};

// Vetëm admini
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.role() === 'admin') {
    return true;
  }
  return router.createUrlTree([auth.isLoggedIn() ? '/home' : '/login']);
};