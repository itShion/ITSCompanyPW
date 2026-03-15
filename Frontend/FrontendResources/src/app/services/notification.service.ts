import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notifica {
  tipo: 'successo' | 'errore' | 'info';
  messaggio: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifiche$ = new Subject<Notifica>();
  notifiche$ = this._notifiche$.asObservable();

  successo(messaggio: string) {
    this._notifiche$.next({ tipo: 'successo', messaggio });
  }

  errore(messaggio: string) {
    this._notifiche$.next({ tipo: 'errore', messaggio });
  }

  info(messaggio: string) {
    this._notifiche$.next({ tipo: 'info', messaggio });
  }
}