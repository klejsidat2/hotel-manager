import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Publike (pa login)
  {
    path: 'home',
    loadComponent: () => import('./home-page/home-page').then((m) => m.HomePageComponent),
  },
  {
    path: 'rooms',
    loadComponent: () =>
      import('./property-rooms/property-rooms').then((m) => m.PropertyRoomsComponent),
  },
  {
    path: 'rooms/:id',
    loadComponent: () =>
      import('./room-detail/room-detail').then((m) => m.RoomDetailComponent),
  },
  {
    path: 'book',
    loadComponent: () => import('./book-page/book-page').then((m) => m.BookPageComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./about-page/about-page').then((m) => m.AboutPageComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact-page/contact-page').then((m) => m.ContactPageComponent),
  },
  { path: 'hotels', redirectTo: 'rooms', pathMatch: 'full' },

  // Hyrja vetëm për adminin
  {
    path: '',
    loadComponent: () =>
      import('./auth-page/auth-page.component').then((m) => m.AuthPageComponent),
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
  { path: 'signup', redirectTo: 'login', pathMatch: 'full' },

  // Admin (vetëm roli admin)
  {
    path: 'admin/reservations',
    loadComponent: () =>
      import('./booking-admin/booking-admin').then((m) => m.BookingAdminComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/rooms',
    loadComponent: () => import('./rooms-admin/rooms-admin').then((m) => m.RoomsAdminComponent),
    canActivate: [adminGuard],
  },
  { path: 'admin', redirectTo: 'admin/reservations', pathMatch: 'full' },
  { path: 'reservations', redirectTo: 'admin/reservations', pathMatch: 'full' },

  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];