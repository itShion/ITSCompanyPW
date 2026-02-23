import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RisorsaService } from '../app/services/RisorsaService';
import { Risorsa } from '../models/Risorsa';
import { RouterLink } from "@angular/router";
import { navbarv2 } from '../app/navbarv2/navbarv2';


@Component({
  selector: 'app-prenotazionitab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, navbarv2],
  templateUrl: './prenotazionitab.html',
  styleUrl: './prenotazionitab.css',
})
export class Prenotazionitab implements OnInit {

  private risorsaService = inject(RisorsaService);
  tabella: Risorsa[] = [];


  private originalIndexes = new Map<string, number>();
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