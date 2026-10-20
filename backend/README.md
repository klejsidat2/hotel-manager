Backend for a single-hotel booking site. Guests browse rooms and book without an account. An admin signs in to manage rooms, photos and reservations.

The Angular frontend is in a separate repository: [hotel-manager](https://github.com/klejsidat2/hotel-manager).

## Stack

- Java 21, Spring Boot 4.1.1, Maven
- Spring Data JPA (Hibernate) on MySQL 8
- Spring Security with stateless JWT authentication (jjwt), passwords hashed with BCrypt
- Bean Validation, centralized error handling with `@RestControllerAdvice`
- Lombok

## Features
- Rooms have a description in Albanian and an optional one in English. The frontend shows the English one when the site is in English, and falls back to the Albanian text if it is empty.

- Public endpoints for listing rooms, viewing a room with its photos, and creating a booking.
- Booking rules:
    - check-out must be after check-in
    - overlapping dates for the same room are rejected with `409 Conflict`
    - the total price is calculated on the server (nights x nightly rate)
    - a check-out and a check-in on the same day do not conflict, and cancelled bookings do not block a room
- Admin login returns a JWT. Admins can create, update and delete rooms, upload and delete photos, and list, confirm, cancel or delete bookings.
- A room that has bookings cannot be deleted.
- Photos: jpg, png, webp or gif, up to 10 MB, stored on disk in `uploads/` and served under `/uploads/`.

## Running locally

Requires JDK 21 and MySQL 8.

1. Create the database:

```sql
   CREATE DATABASE booking CHARACTER SET utf8mb4;
```

2. Copy `src/main/resources/application.properties.example` to `src/main/resources/application.properties` and fill in your MySQL password, a JWT secret of at least 32 characters, and the admin email and password. This file is git-ignored.

3. Start the application. It creates the tables, and on the first run it creates the admin user from the values above.

```
   ./mvnw spring-boot:run
```

On Windows PowerShell use `.\mvnw spring-boot:run`. The API runs on `http://localhost:8080`.

4. Optional: load the sample hotel and rooms. Run this after the first start, once the tables exist.

```
   mysql -u root -p --default-character-set=utf8mb4 booking -e "source database/seed.sql"
```

## API

Public:

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Returns a JWT |
| GET | `/api/properties` | Hotels, optional `?city=` filter |
| GET | `/api/rooms?propertyId=` | Rooms of a hotel |
| GET | `/api/rooms/{id}` | One room with its photos |
| POST | `/api/bookings` | Create a booking |
| GET | `/uploads/{file}` | Room photos |

Admin only (send `Authorization: Bearer <token>`):

| Method | Path | Description |
|---|---|---|
| POST | `/api/properties` | Create a hotel |
| POST | `/api/rooms` | Create a room |
| PUT | `/api/rooms/{id}` | Update a room |
| DELETE | `/api/rooms/{id}` | Delete a room |
| POST | `/api/rooms/{id}/photos` | Upload photos (multipart, field `files`) |
| DELETE | `/api/rooms/{id}/photos/{photoId}` | Delete a photo |
| GET | `/api/bookings` | List all bookings |
| PATCH | `/api/bookings/{id}/status` | Set status: `PENDING`, `CONFIRMED` or `CANCELLED` |
| DELETE | `/api/bookings/{id}` | Delete a booking |

Errors are returned as JSON. Validation failures (`400`) map each field to a message, other errors use `{"error": "..."}`. Status codes in use: `400` invalid input, `401` missing or invalid token, `404` not found, `409` conflict, `413` file too large.

## Project layout

```
src/main/java/com/booking/bookingapi/
  config/        security, static resources, admin seeding
  controller/    REST controllers
  dto/           request and response records
  entity/        JPA entities
  exception/     custom exceptions and global handler
  repository/    Spring Data repositories
  security/      JWT service and request filter
  service/       business logic
database/seed.sql
```

## Known limitations

- There are no automated tests yet.
- Bookings are not tied to user accounts. The `OWNER` role and the `Review` entity exist in the model but are not used.
- Schema management relies on `ddl-auto=update`. A real deployment would use migrations (for example Flyway).
- CORS only allows `localhost` origins, and uploaded photos are stored on the local disk.