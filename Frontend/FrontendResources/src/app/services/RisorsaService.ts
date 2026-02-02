import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Risorsa } from '../../models/Risorsa';
import { TipoRisorsa } from '../../models/TipoRisorsa';

@Injectable({
  providedIn: 'root'
})
export class RisorsaService {
  private http = inject(HttpClient);
  private apiUrl = 'api/v1';

  getRisorse(): Observable<Risorsa[]> {
    return this.http.get<Risorsa[]>(`${this.apiUrl}/risorse/`);
  }

  getRisorsa(id: number): Observable<Risorsa> {
    return this.http.get<Risorsa>(`${this.apiUrl}/risorse/${id}/`);
  }
  
  getTipiRisorsa(): Observable<TipoRisorsa[]> {
    return this.http.get<TipoRisorsa[]>(`${this.apiUrl}/tipo-risorse/`);
  }
}
