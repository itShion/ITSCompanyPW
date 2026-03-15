import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente, NuovoUtenteDTO } from '../../models/Utente';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {
  private apiUrl = 'api/v1/utenti';

  constructor(private http: HttpClient) {}

  getUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/`);
  }

  getAllUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/?all=true`)
  }

  getUtentiDisabilitati(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/?disabilitati=true`);
  }

  getUtente(id: number): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/${id}/`);
  }

  creaUtente(utente: NuovoUtenteDTO): Observable<Utente> {
    return this.http.post<Utente>(`${this.apiUrl}/`, utente);
  }

  modificaUtente(id: number, utente: Partial<Utente>): Observable<Utente> {
    return this.http.patch<Utente>(`${this.apiUrl}/${id}/`, utente);
  }

  disabilitaUtente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }

  riabilitaUtente(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/riabilita/`, {});
  }
}
