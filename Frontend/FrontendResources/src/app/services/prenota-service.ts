import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Prenotazione, PrenotazioneDTO } from '../../models/Prenotazione';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrenotaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/v1';

  getPrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/prenotazioni/`);
  }

  getPrenotazione(id: number): Observable<Prenotazione> {
    return this.http.get<Prenotazione>(`${this.apiUrl}/prenotazioni/${id}/`);
  }

  createPrenotazione(prenotazione: PrenotazioneDTO): Observable<PrenotazioneDTO> {
    return this.http.post<PrenotazioneDTO>(`${this.apiUrl}/prenotazioni/`, prenotazione);
  }
}
