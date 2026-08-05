import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Utente,LoginDTO,RegisterDTO,DjangoAuthResponse, CurrentUser } from '../../models/Utente'
import { NotificaResponse } from '../../models/Notifica';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificaService {
  private apiUrl = `${environment.apiUrl}/api/notifiche`;

  constructor(private http: HttpClient) {}


// notifica.service.ts
getUnread(): Observable<NotificaResponse> {
return this.http.get<NotificaResponse>(`${this.apiUrl}/unread/`);}

getAll(): Observable<NotificaResponse> {
  return this.http.get<NotificaResponse>(`${this.apiUrl}/`);
}

markRead(id: number) {
  return this.http.post(
    `${this.apiUrl}/${id}/mark_read/`,
    {}
  );
}
}
