 // src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface User {
  id?: number;
  username: string;
  email?: string;
  ruolo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  //private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentUserSubject = new ReplaySubject<any>(1);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      this.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  // METODO REGISTER
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData).pipe(
      tap((response: any) => {
        console.log('Registrazione completata', response);
        // Opzionale: login automatico dopo la registrazione
        // Se l'API ritorna i token dopo la registrazione
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);

          this.getCurrentUser().subscribe({
            next: (user) => {
              localStorage.setItem('current_user', JSON.stringify(user));
              this.currentUserSubject.next(user);
              //console.log('Utente salvato in localStorage:', user);
            },
            error: (err) => console.error('Errore caricamento utente:', err)
          });
        }
      })
    );
  }

  // METODO LOGIN
  login(credentials: { username: string, password: string }): Observable<any> {

    return this.http.post(`${this.apiUrl}/token/`, credentials).pipe(
      tap((response: any) => {
        console.log('Login response:', response);

        // Salva i token (JWT di solito restituisce access e refresh)
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);

          // Dopo aver ottenuto il token, carica i dati dell'utente
          this.getCurrentUser().subscribe({
            next: (user) => {
              localStorage.setItem('current_user', JSON.stringify(user));
              this.currentUserSubject.next(user);
            },
            error: (err) => console.error('Errore caricamento utente:', err)
          });
        }
      })
    );
  }

  getCurrentUser(): Observable<User> {
    // Endpoint per ottenere i dati dell'utente corrente
    return this.http.get<User>(`${this.apiUrl}/current-user/`);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh/`, { refresh: refreshToken }).pipe(
      tap((response: any) => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user')
    this.currentUserSubject.next(null);

    this.router.navigate(['/loginv2'])
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
