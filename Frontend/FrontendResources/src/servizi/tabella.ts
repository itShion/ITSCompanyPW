import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Postazione } from '../postazione/postazione';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TabellaHttpService {
  private apiUrl = 'http://localhost:3000/apirest/postazioni';

  constructor(private http: HttpClient) {}

  getPostazione(): Observable<Postazione[]> {
    return this.http.get<Postazione[]>(this.apiUrl);
  }

  getPostazioneById(id: string): Observable<Postazione> {
    return this.http.get<Postazione>(`${this.apiUrl}/${id}`);
  }

  aggiornaPostazione(p: Postazione): Observable<any> {
    return this.http.put(`${this.apiUrl}/${p.id}`, p);
  }

  aggiungiPostazione(p: Postazione): Observable<any> {
    return this.http.post(this.apiUrl, p);
  }

  eliminaPostazione(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}