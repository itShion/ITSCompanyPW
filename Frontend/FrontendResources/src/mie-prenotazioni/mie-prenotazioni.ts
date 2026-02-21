import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prenotazione } from '../models/Prenotazione';
import { PrenotaService } from '../app/services/prenota-service';
import { StatoPrenotazioneService } from '../app/services/stato-prenotazione-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'mie-prenotazioni',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './mie-prenotazioni.html',
  styleUrls: ['./mie-prenotazioni.css'],
})
export class MiePrenotazioni implements OnInit {
  prenotazioni = signal<Prenotazione[]>([]);
  loading = signal(true);

  private prenotaService = inject(PrenotaService);
  private statoService = inject(StatoPrenotazioneService);

  // Signal per contatori
  confermate = signal(0);
  inAttesa = signal(0);
  annullate = signal(0);

  ngOnInit(): void {
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni() {
    this.loading.set(true);

    this.prenotaService.getPrenotazioni().subscribe({
      next: (data) => {
        this.prenotazioni.set(data);

        // Aggiorna contatori tramite il service
        this.aggiornaContatori(data);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Errore caricamento:', err);
        this.loading.set(false);
      },
    });
  }

  private aggiornaContatori(prenotazioni: Prenotazione[]) {
    this.confermate.set(
      prenotazioni.filter((p) => p.stato === 'CONFERMATA').length
    );
    this.inAttesa.set(
      prenotazioni.filter((p) => p.stato === 'PENDING').length
    );
    this.annullate.set(
      prenotazioni.filter((p) => p.stato === 'ANNULLATA').length
    );
  }
}