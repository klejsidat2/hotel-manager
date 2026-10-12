import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

export type Role = 'admin' | 'user';

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
}

interface LoginResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

const SESSION_KEY = 'hotel-session';
const TOKEN_KEY = 'hotel-token';
const API = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // seanca vlen vetëm nëse ka edhe token (seancat e vjetra lokale injorohen)
  readonly currentUser = signal<SessionUser | null>(
    localStorage.getItem(TOKEN_KEY) ? this.read<SessionUser | null>(SESSION_KEY, null) : null,
  );
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly role = computed<Role | null>(() => this.currentUser()?.role ?? null);

  token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string): Observable<SessionUser> {
    return this.http
      .post<LoginResponse>(`${API}/auth/login`, { email: email.trim(), password })
      .pipe(
        map((res) => {
          const user: SessionUser = {
            name: res.name,
            email: res.email,
            role: res.role === 'ADMIN' ? 'admin' : 'user',
          };
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(SESSION_KEY, JSON.stringify(user));
          this.currentUser.set(user);
          return user;
        }),
      );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  private read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
}