import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RisorsaService } from '../services/RisorsaService';
import { Risorsa } from '../models/Risorsa';

@Component({
  selector: 'app-risorse-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risorse-list.html',
  styleUrl: './risorse-list.css'
})
export class RisorseListComponent implements OnInit {
  private risorsaService = inject(RisorsaService);
  
  risorse = signal<Risorsa[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRisorse();
  }

  loadRisorse(): void {
    this.risorsaService.getRisorse().subscribe({
      next: (data) => {
        this.risorse.set(data);
        this.loading.set(false);
        console.log('Risorse caricate:', data);
      },
      error: (err) => {
        this.error.set('Errore nel caricamento delle risorse');
        this.loading.set(false);
        console.error('Errore:', err);
      }
    });
  }
}