# Hotel NewInn

Frontend for a single-hotel booking site, built with Angular. Guests browse rooms and book without an account. An admin signs in to manage rooms, photos and reservations.

It talks to the REST API in [booking-api](https://github.com/klejsidat2/booking-api), which has to be running for the site to show any data.

## Stack

- Angular 22 with standalone components and signals
- Lazy-loaded routes, functional route guards, `withComponentInputBinding`
- `HttpClient` with two interceptors: request logging, and attaching the JWT to calls to the API
- Reactive forms for the login page
- ngx-translate for the Albanian and English UI strings, flag-icons for the language switcher

## Pages

| Route | Access | Description |
|---|---|---|
| `/home` | public | Landing page with a selection of rooms |
| `/rooms` | public | List of rooms |
| `/rooms/:id` | public | Room details with a photo gallery |
| `/book` | public | Booking form: room, dates, guest details, live price total |
| `/about`, `/contact` | public | Static pages |
| `/login` | public | Admin sign-in (linked from the footer) |
| `/admin/reservations` | admin | List, confirm, cancel and delete bookings |
| `/admin/rooms` | admin | Create, edit and delete rooms, upload and remove photos |

Guests do not need an account. The admin pages are protected by a route guard in the UI, and the API enforces the same rule on its side by rejecting requests without a valid token.

## Running locally

Requires Node.js and npm (developed with Node 24) and a running instance of [booking-api](https://github.com/klejsidat2/booking-api) on `http://localhost:8080`.

```
npm install
npm start
```

Open `http://localhost:4200`. The admin credentials are the ones configured in the API's `application.properties`.

Other scripts: `npm run build` for a production build.

## Configuration

- The API address, `http://localhost:8080`, is set in `src/app/properties.service.ts`, `src/app/auth.service.ts` and `src/app/auth.interceptor.ts`.
- The site shows one hotel. Its id is set in `src/app/hotel.config.ts`.

## Project layout

```
src/app/
  home-page, property-rooms, room-detail, book-page, about-page, contact-page   public pages
  login, auth-page                                                              sign-in
  booking-admin, rooms-admin                                                    admin pages
  header, footer, language-switcher                                             layout
  auth.service.ts, auth.interceptor.ts, auth.guard.ts                           authentication
  properties.service.ts                                                         API calls
public/i18n/                                                                    sq.json, en.json
```

## Known limitations

- There are no automated tests yet.
- Only the layout, login page and language switcher are translated. The public pages and the admin pages are written in Albanian, and room descriptions are whatever the admin entered.
- The API URL is hard-coded rather than read from an environment file.
- The JWT is kept in `localStorage`, which is simple but exposed to XSS. An httpOnly cookie would be safer.
- The admin pages are not responsive on small screens.