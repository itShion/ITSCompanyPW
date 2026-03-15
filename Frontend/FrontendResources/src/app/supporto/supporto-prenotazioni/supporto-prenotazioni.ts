import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prenotazione, PrenotazioneDTO } from '../../../models/Prenotazione';
import { Risorsa } from '../../../models/Risorsa';
import { PrenotaService } from '../../services/prenota-service';
import { RisorsaService } from '../../services/RisorsaService';
import { SupportoPrenotazioneDettaglio } from "./supporto-prenotazioni-dettaglio/supporto-prenotazioni-dettaglio";

@Component({
  selector: 'app-supporto-prenotazioni',
  standalone: true,
  imports: [CommonModule, FormsModule, SupportoPrenotazioneDettaglio],
  templateUrl: './supporto-prenotazioni.html',
  styleUrl: './supporto-prenotazioni.css',
})
export class SupportoPrenotazioni implements OnInit {
  prenotazioni = signal<Prenotazione[]>([]);
  risorse = signal<Risorsa[]>([]);

  dettaglioAperto = signal(false);
  prenotazioneDettaglio = signal<Prenotazione | null>(null);

  // Stats
  get inAttesa() {
    return this.prenotazioni().filter((p) => p.stato === 'PENDING').length;
  }
  get approvate() {
    return this.prenotazioni().filter((p) => p.stato === 'CONFERMATA').length;
  }
  get rifiutate() {
    return this.prenotazioni().filter((p) => p.stato === 'ANNULLATA').length;
  }

  paginaCorrente = signal(1);
  perPagina = 5;
  get totalPages() {
    return Math.ceil(this.prenotazioni().length / this.perPagina);
  }
  get prenotazioniPaginate() {
    const start = (this.paginaCorrente() - 1) * this.perPagina;
    return this.prenotazioni().slice(start, start + this.perPagina);
  }
  paginaPrecedente() {
    if (this.paginaCorrente() > 1) this.paginaCorrente.update((p) => p - 1);
  }
  paginaSuccessiva() {
    if (this.paginaCorrente() < this.totalPages) this.paginaCorrente.update((p) => p + 1);
  }
  min(a: number, b: number) {
    return Math.min(a, b);
  }

  // Modal
  modalAperto = signal(false);
  nuova: PrenotazioneDTO = { risorsa_id: 0, data_inizio: '', data_fine: '', motivo: '' };
  openModal() {
    this.modalAperto.set(true);
  }
  closeModal() {
    this.modalAperto.set(false);
    this.nuova = { risorsa_id: 0, data_inizio: '', data_fine: '', motivo: '' };
  }

  // Badge
  getBadgeClass(stato: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-orange',
      CONFERMATA: 'badge-green',
      ANNULLATA: 'badge-red',
    };
    return map[stato] ?? '';
  }

  constructor(
    private prenotaService: PrenotaService,
    private risorsaService: RisorsaService,
  ) { }

  ngOnInit() {
    this.loadPrenotazioni();
    this.risorsaService.getRisorse().subscribe((data) => this.risorse.set(data));
  }

  loadPrenotazioni() {
    this.prenotaService.getPrenotazioni().subscribe((data) => {
      this.prenotazioni.set(data);
      this.paginaCorrente.set(1);
    });
  }

  creaPrenotazione() {
    this.prenotaService.createPrenotazione(this.nuova).subscribe(() => {
      this.loadPrenotazioni();
      this.closeModal();
    });
  }

  popupAperto = signal(false);
  azioneCorrente = signal<'approva' | 'rifiuta' | null>(null);
  prenotazioneSelezionata = signal<number | null>(null);

  apriPopup(id: number, azione: 'approva' | 'rifiuta') {
    this.prenotazioneSelezionata.set(id);
    this.azioneCorrente.set(azione);
    this.popupAperto.set(true);
  }

  chiudiPopup() {
    this.popupAperto.set(false);
    this.prenotazioneSelezionata.set(null);
    this.azioneCorrente.set(null);
  }

  confermaAzione() {
    const id = this.prenotazioneSelezionata();
    const azione = this.azioneCorrente();
    if (!id || !azione) return;

    const chiamata =
      azione === 'approva'
        ? this.prenotaService.approvaPrenotazione(id)
        : this.prenotaService.rifiutaPrenotazione(id);

    chiamata.subscribe(() => {
      this.loadPrenotazioni();
      this.chiudiPopup();
    });
  }

  openDettaglio(p: Prenotazione) {
    this.prenotazioneDettaglio.set(p);
    this.dettaglioAperto.set(true);
  }

  closeDettaglio() {
    this.dettaglioAperto.set(false);
    this.prenotazioneDettaglio.set(null);
  }

  onApprovaDettaglio(id: number) {
    this.prenotaService.approvaPrenotazione(id).subscribe(() => {
      this.loadPrenotazioni();
      this.closeDettaglio();
    });
  }
  onRifiutaDettaglio(id: number) {
    this.prenotaService.rifiutaPrenotazione(id).subscribe(() => {
      this.loadPrenotazioni();
      this.closeDettaglio();
    });
  }
}
