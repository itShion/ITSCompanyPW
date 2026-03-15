import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Utente } from '../../models/Utente';
import { Observable } from 'rxjs';
import { Prenotazione } from '../../models/Prenotazione';
import { Risorsa } from '../../models/Risorsa';

@Injectable({
  providedIn: 'root',
})
export class UtilsReportService {
  private http = inject(HttpClient);
  private apiUrl = 'api/v1';

  getAllUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/utenti/`);
  }

  getAllPrenotazioniAttive(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/prenotazioni/attive`);
  }

  getAllRisorseDisponibili(): Observable<Risorsa[]> {
    return this.http.get<Risorsa[]>(`${this.apiUrl}/risorse/`);
  }

  getAllPendingPrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/prenotazioni/pending/`);
  }
}
