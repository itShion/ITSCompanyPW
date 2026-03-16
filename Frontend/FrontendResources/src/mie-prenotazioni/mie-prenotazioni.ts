import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Prenotazione } from '../models/Prenotazione';
import { PrenotaService } from '../app/services/prenota-service';
import { StatoPrenotazioneService } from '../app/services/stato-prenotazione-service';

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

  confermate = signal(0);
  inAttesa = signal(0);
  annullate = signal(0);

  showAnnullaModal = signal(false);
  prenotazioneSelezionata = signal<Prenotazione | null>(null);

  ngOnInit(): void {
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni() {
    this.loading.set(true);
    this.prenotaService.getPrenotazioni().subscribe({
      next: (data) => {
        this.prenotazioni.set(data);
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
    this.confermate.set(prenotazioni.filter(p => p.stato === 'CONFERMATA').length);
    this.inAttesa.set(prenotazioni.filter(p => p.stato === 'PENDING').length);
    this.annullate.set(prenotazioni.filter(p => p.stato === 'ANNULLATA').length);
  }

  openAnnullaModal(p: Prenotazione) {
    this.prenotazioneSelezionata.set(p);
    this.showAnnullaModal.set(true);
  }

  closeAnnullaModal() {
    this.showAnnullaModal.set(false);
  }

  confirmAnnullaPrenotazione() {
    const p = this.prenotazioneSelezionata();
    if (!p) return;
    this.showAnnullaModal.set(false);
    this.annullaPrenotazione(p);
  }

  annullaPrenotazione(p: Prenotazione) {
    if (!p.id) return;
    this.loading.set(true);
    this.prenotaService.annullaPrenotazione(p.id).subscribe({
      next: (updatedPrenotazione: Prenotazione) => {
        const updated = this.prenotazioni().map(pr =>
          pr.id === updatedPrenotazione.id ? updatedPrenotazione : pr
        );
        this.prenotazioni.set(updated);
        this.aggiornaContatori(updated);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Errore annullamento prenotazione:', err);
        this.loading.set(false);
        alert('Errore durante l\'annullamento della prenotazione.');
      }
    });
  }


  paginaCorrente = signal(1);
  perPagina = 5;
  get totalPages() {
    return Math.ceil(this.prenotazioni().length / this.perPagina);
  }
  prenotazioniPaginate = computed(() => {
    const start = (this.paginaCorrente() - 1) * this.perPagina;
    return this.prenotazioni().slice(start, start + this.perPagina);
  });
  paginaPrecedente() {
    if (this.paginaCorrente() > 1) this.paginaCorrente.update((p) => p - 1);
  }
  paginaSuccessiva() {
    if (this.paginaCorrente() < this.totalPages) this.paginaCorrente.update((p) => p + 1);
  }
  min(a: number, b: number) {
    return Math.min(a, b);
  }
}