import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Prenotazione } from '../../models/Prenotazione';
import { PrenotaService } from './prenota-service';

@Injectable({
  providedIn: 'root'
})
export class StatoPrenotazioneService {
  private http = inject(HttpClient);
  private prenotaService = inject(PrenotaService);
  private apiUrl = 'http://localhost:8000/api/v1';

  getPrenotazioniConfermate(): Observable<number> {
    return this.prenotaService.getPrenotazioni().pipe(
      map(prenotazioni =>
        prenotazioni.filter(p => p.stato === 'CONFERMATA').length
      )
    );
  }

  getPrenotazioniInAttesa(): Observable<number> {
    return this.prenotaService.getPrenotazioni().pipe(
      map(prenotazioni =>
        prenotazioni.filter(p => p.stato === 'PENDING').length
      )
    );
  }

  getPrenotazioniRifiutate(): Observable<number> {
    return this.prenotaService.getPrenotazioni().pipe(
      map(prenotazioni =>
        prenotazioni.filter(p => p.stato === 'ANNULLATA').length
      )
    );
  }

}