 // src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Utente,LoginDTO,RegisterDTO,DjangoAuthResponse, CurrentUser } from '../../models/Utente'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private authApiUrl = 'http://localhost:8000/api';

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadStoredUser();
  }

  // ============ LOGIN ============
  login(dto: LoginDTO): Observable<DjangoAuthResponse> {
    return this.http.post<DjangoAuthResponse>(`${this.authApiUrl}/token/`, dto).pipe(
      tap(response => {
        const utente: CurrentUser = {
          id: response.user.utente_id,
          username: response.user.username,
          ruolo: response.user.ruolo,
          telefono: response.user.telefono,
          user_id: response.user.id
        };
        
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('current_user', JSON.stringify(utente));
        this.currentUserSubject.next(utente);
      })
    );
  }

  // ============ REGISTER ============
  register(dto: RegisterDTO): Observable<DjangoAuthResponse> {
    return this.http.post<DjangoAuthResponse>(`${this.authApiUrl}/register/`, dto).pipe(
      tap(response => {
        const utente: CurrentUser = {
          id: response.user.utente_id,
          username: response.user.username,
          ruolo: response.user.ruolo,
          telefono: response.user.telefono,
          user_id: response.user.id
        };
        
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('current_user', JSON.stringify(utente));
        this.currentUserSubject.next(utente);
      })
    );
  }

  // ============ LOGOUT ============
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/loginv2']);
  }

  // ============ UTILITIES ============
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // ============ PRIVATE ============
  private loadStoredUser(): void {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }
}