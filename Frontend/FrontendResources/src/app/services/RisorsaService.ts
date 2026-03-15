import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Risorsa, RisorsaCreate } from '../../models/Risorsa';
import { TipoRisorsa } from '../../models/TipoRisorsa';

@Injectable({
  providedIn: 'root'
})
export class RisorsaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/v1';

  getRisorse(): Observable<Risorsa[]> {
    return this.http.get<Risorsa[]>(`${this.apiUrl}/risorse/`);
  }

  getRisorsa(id: number): Observable<Risorsa> {
    return this.http.get<Risorsa>(`${this.apiUrl}/risorse/${id}/`);
  }

  getTipiRisorsa(): Observable<TipoRisorsa[]> {
    return this.http.get<TipoRisorsa[]>(`${this.apiUrl}/tipo-risorse/`);
  }

  createRisorsa(risorsa: RisorsaCreate): Observable<Risorsa> {
    return this.http.post<Risorsa>(`${this.apiUrl}/risorse/`, risorsa);
  }

  createTipoRisorsa(tipo: { nome: string; descrizione: string; immagine_url: string }): Observable<TipoRisorsa> {
    return this.http.post<TipoRisorsa>(`${this.apiUrl}/tipo-risorse/`, tipo);
  }

  setAttiva(id: number): Observable<Risorsa> {
    return this.http.post<Risorsa>(`${this.apiUrl}/risorse/${id}/attiva/`, {});
  }

  setManutenzione(id: number): Observable<Risorsa> {
    return this.http.post<Risorsa>(`${this.apiUrl}/risorse/${id}/manutenzione/`, {});
  }

  setDisattiva(id: number): Observable<Risorsa> {
    return this.http.post<Risorsa>(`${this.apiUrl}/risorse/${id}/disattiva/`, {});
  }

  deleteRisorsa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/risorse/${id}/`);
  }
  
  updateRisorsa(id: number, risorsa: RisorsaCreate): Observable<Risorsa> {
    return this.http.put<Risorsa>(`${this.apiUrl}/risorse/${id}/`, risorsa);
  }

  updateTipoRisorsa(id: number, tipo: { nome: string; descrizione: string; immagine_url: string }): Observable<TipoRisorsa> {
    return this.http.put<TipoRisorsa>(`${this.apiUrl}/tipo-risorse/${id}/`, tipo);
  }

}