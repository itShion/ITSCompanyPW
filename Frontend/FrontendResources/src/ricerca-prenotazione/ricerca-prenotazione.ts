import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RisorsaService } from '../app/services/RisorsaService';
import { AuthService } from '../app/services/auth.service';
import { Risorsa } from '../models/Risorsa';

@Component({
  selector: 'app-ricerca-prenotazione',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ricerca-prenotazione.html',
  styleUrl: './ricerca-prenotazione.css',
})
export class RicercaPrenotazione {

  private risorsaService = inject(RisorsaService);
  private authService = inject(AuthService);

  // ===== DATA =====
  risorse = signal<Risorsa[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // ===== MODAL =====
  showModal = signal(false);
  selectedRisorsa = signal<Risorsa | null>(null);
  utente = signal(this.authService.getCurrentUser());

  data = signal('');
  oraInizio = signal('');
  oraFine = signal('');

  // ===== INIT =====
  ngOnInit() {
    this.loadRisorse();
  }

  loadRisorse() {
    this.loading.set(true);

    this.risorsaService.getRisorse().subscribe({
      next: (data) => {
        this.risorse.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set("Errore caricamento risorse");
        this.loading.set(false);
      }
    });
  }

  // ===== MODAL ACTIONS =====

  openPrenotaModal(r: Risorsa) {
    this.selectedRisorsa.set(r);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  confermaPrenotazione() {
    console.log("PRENOTAZIONE:", {
      utente: this.utente(),
      risorsa: this.selectedRisorsa(),
      data: this.data(),
      da: this.oraInizio(),
      a: this.oraFine()
    });
    this.closeModal();
  }

}
