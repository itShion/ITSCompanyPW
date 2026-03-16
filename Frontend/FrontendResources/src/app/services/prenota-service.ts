import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Prenotazione, PrenotazioneDTO } from '../../models/Prenotazione';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrenotaService {
  private apiUrl = 'http://localhost:8000/api/v1/prenotazioni/';

  constructor(private http: HttpClient) { }

  getPrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(this.apiUrl);
  }

  createPrenotazione(prenotazione: PrenotazioneDTO): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(this.apiUrl, prenotazione);
  }

  annullaPrenotazione(id: number): Observable<Prenotazione> {
  return this.http.post<Prenotazione>(`${this.apiUrl}${id}/annulla/`, {});
  }

  // annullaPrenotazione(id: number): Observable<Prenotazione> {
  //   return this.http.patch<Prenotazione>(`${this.apiUrl}${id}/`, {
  //     stato: 'ANNULLATA',
  //   });
  // }

  approvaPrenotazione(id: number): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(`${this.apiUrl}${id}/approva/`, {});
  }

  rifiutaPrenotazione(id: number): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(`${this.apiUrl}${id}/rifiuta/`, {});
  }

  accettaPartecipazione(id: number): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(`${this.apiUrl}${id}/accetta_partecipazione/`, {});
  }

  rifiutaPartecipazione(id: number): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(`${this.apiUrl}${id}/rifiuta_partecipazione/`, {});
  }
}
