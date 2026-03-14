import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente } from '../../models/Utente';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {
  private apiUrl = 'api/v1/utenti';

  constructor(private http: HttpClient) {}

  getUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/`);
  }

  getUtente(id: number): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/${id}/`);
  }

  creaUtente(utente: Partial<Utente>): Observable<Utente> {
    return this.http.post<Utente>(`${this.apiUrl}/`, utente);
  }

  modificaUtente(id: number, utente: Partial<Utente>): Observable<Utente> {
    return this.http.patch<Utente>(`${this.apiUrl}/${id}/`, utente);
  }

  eliminaUtente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
