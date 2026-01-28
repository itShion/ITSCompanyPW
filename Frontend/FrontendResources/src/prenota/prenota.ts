import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RisorsaService } from '../services/RisorsaService';
import { signal } from '@angular/core';
import { Risorsa } from '../models/Risorsa';

@Component({
  selector: 'app-prenota',
  standalone: true,
  templateUrl: './prenota.html',
  styleUrls: ['./prenota.css'],
})
export class Prenota {
  private risorsaService = inject(RisorsaService);
  private route = inject(ActivatedRoute);

  risorsa = signal<Risorsa | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRisorsa(id);
  }

  loadRisorsa(id: number) {
    this.risorsaService.getRisorsa(id).subscribe({
      next: (data) => this.risorsa.set(data), 
      error: (err) => console.error('Errore:', err),
    });
  }
}
