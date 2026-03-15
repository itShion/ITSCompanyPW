import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Utente,LoginDTO,RegisterDTO,DjangoAuthResponse, CurrentUser } from '../../models/Utente'
import { NotificaResponse } from '../../models/Notifica';

@Injectable({ providedIn: 'root' })
export class NotificaService {
  constructor(private http: HttpClient) {}

  
// notifica.service.ts
getUnread(): Observable<NotificaResponse> {
return this.http.get<NotificaResponse>('http://localhost:8000/api/notifiche/unread/');}

getAll(): Observable<NotificaResponse[]> {
  return this.http.get<NotificaResponse[]>('http://localhost:8000/api/notifiche/');
}

markRead(id: number) {
  return this.http.post(
    `http://localhost:8000/api/notifiche/${id}/mark_read/`,
    {}
  );
}
}
