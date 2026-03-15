import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RisorsaService } from '../../services/RisorsaService';
import { Risorsa, RisorsaCreate, StatoRisorsa } from '../../../models/Risorsa';
import { TipoRisorsa } from '../../../models/TipoRisorsa';
import { SupportoNewRisorsaComponent } from './supporto-new-risorsa/supporto-new-risorsa';

@Component({
  selector: 'app-supporto-risorse',
  standalone: true,
  imports: [CommonModule, FormsModule, SupportoNewRisorsaComponent],
  templateUrl: './supporto-risorse.html',
  styleUrl: './supporto-risorse.css'
})
export class SupportoRisorse implements OnInit {

  risorse = signal<Risorsa[]>([]);
  tipiRisorsa = signal<TipoRisorsa[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  paginaCorrente = signal(1);
  perPagina = 5;

  get totalPages() {
    return Math.ceil(this.risorse().length / this.perPagina);
  }

  get risorsePaginate() {
    const start = (this.paginaCorrente() - 1) * this.perPagina;
    return this.risorse().slice(start, start + this.perPagina);
  }

  paginaPrecedente() {
    if (this.paginaCorrente() > 1) this.paginaCorrente.update(p => p - 1);
  }

  paginaSuccessiva() {
    if (this.paginaCorrente() < this.totalPages) this.paginaCorrente.update(p => p + 1);
  }

  min(a: number, b: number) {
    return Math.min(a, b);
  }

  modalRisorsaAperto = signal(false);

  openModalRisorsa() {
    this.errorMessage.set('');
    this.modalRisorsaAperto.set(true);
  }

  closeModalRisorsa() {
    this.modalRisorsaAperto.set(false);
  }

  onSaveRisorsa(risorsa: RisorsaCreate) {
    this.risorsaService.createRisorsa(risorsa).subscribe({
      next: () => {
        this.loadRisorse();
        this.closeModalRisorsa();
      },
      error: () => this.errorMessage.set('Errore durante la creazione')
    });
  }

  modalTipoAperto = signal(false);
  nuovoTipo = { nome: '', descrizione: '', immagine_url: '' };

  openModalTipo() {
    this.nuovoTipo = { nome: '', descrizione: '', immagine_url: '' };
    this.errorMessage.set('');
    this.modalTipoAperto.set(true);
  }

  closeModalTipo() {
    this.modalTipoAperto.set(false);
  }

  creaTipo() {
    if (!this.nuovoTipo.nome) {
      this.errorMessage.set('Il nome è obbligatorio');
      return;
    }
    this.risorsaService.createTipoRisorsa(this.nuovoTipo).subscribe({
      next: () => {
        this.loadTipi();
        this.closeModalTipo();
      },
      error: () => this.errorMessage.set('Errore durante la creazione del tipo')
    });
  }

  // ===== MODAL DETTAGLIO/MODIFICA =====
  modalDettaglioAperto = signal(false);
  risorsaSelezionata = signal<Risorsa | null>(null);
  risorsaInModifica: RisorsaCreate = this.getRisorsaVuota();

  getRisorsaVuota(): RisorsaCreate {
    return {
      nome: '',
      descrizione: '',
      capacita: 1,
      tipo_id: 0,
      orario_apertura: '08:00',
      orario_chiusura: '18:00',
      lunedi: true,
      martedi: true,
      mercoledi: true,
      giovedi: true,
      venerdi: true,
      sabato: false,
      domenica: false,
    };
  }

  openDettaglio(r: Risorsa) {
    this.risorsaSelezionata.set(r);
    this.risorsaInModifica = {
      nome: r.nome,
      descrizione: r.descrizione,
      capacita: r.capacita,
      tipo_id: r.tipo.id,
      orario_apertura: r.orario_apertura.slice(0, 5),
      orario_chiusura: r.orario_chiusura.slice(0, 5),
      lunedi: r.lunedi,
      martedi: r.martedi,
      mercoledi: r.mercoledi,
      giovedi: r.giovedi,
      venerdi: r.venerdi,
      sabato: r.sabato,
      domenica: r.domenica,
    };
    this.errorMessage.set('');
    this.modalDettaglioAperto.set(true);
  }

  closeDettaglio() {
    this.modalDettaglioAperto.set(false);
    this.risorsaSelezionata.set(null);
  }

  salvaModifica() {
    const r = this.risorsaSelezionata();
    if (!r) return;

    this.risorsaService.updateRisorsa(r.id, this.risorsaInModifica).subscribe({
      next: (updated) => {
        this.aggiornaRisorsa(updated);
        this.closeDettaglio();
      },
      error: () => this.errorMessage.set('Errore durante la modifica')
    });
  }

  // ===== MODAL MODIFICA TIPO =====
  modalModificaTipoAperto = signal(false);
  tipoInModifica: { id: number; nome: string; descrizione: string; immagine_url: string } | null = null;

  apriModificaTipo() {
    const r = this.risorsaSelezionata();
    if (!r) return;

    this.tipoInModifica = {
      id: r.tipo.id,
      nome: r.tipo.nome,
      descrizione: r.tipo.descrizione,
      immagine_url: r.tipo.immagine_url
    };

    this.closeDettaglio();
    this.errorMessage.set('');
    this.modalModificaTipoAperto.set(true);
  }

  chiudiModificaTipo() {
    this.modalModificaTipoAperto.set(false);
    this.tipoInModifica = null;
  }

  salvaModificaTipo() {
    if (!this.tipoInModifica) return;

    this.risorsaService.updateTipoRisorsa(this.tipoInModifica.id, {
      nome: this.tipoInModifica.nome,
      descrizione: this.tipoInModifica.descrizione,
      immagine_url: this.tipoInModifica.immagine_url
    }).subscribe({
      next: () => {
        this.loadRisorse();
        this.loadTipi();
        this.chiudiModificaTipo();
      },
      error: () => this.errorMessage.set('Errore durante la modifica del tipo')
    });
  }

  // ===== CANCELLAZIONE =====
  popupCancellaAperto = signal(false);
  risorsaDaCancellare = signal<Risorsa | null>(null);

  apriPopupCancella(r: Risorsa) {
    this.risorsaDaCancellare.set(r);
    this.popupCancellaAperto.set(true);
  }

  chiudiPopupCancella() {
    this.popupCancellaAperto.set(false);
    this.risorsaDaCancellare.set(null);
  }

  confermaCancella() {
    const r = this.risorsaDaCancellare();
    if (!r) return;

    this.risorsaService.deleteRisorsa(r.id).subscribe({
      next: () => {
        this.risorse.update(list => list.filter(x => x.id !== r.id));
        this.chiudiPopupCancella();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error ?? 'Errore durante la cancellazione');
        this.chiudiPopupCancella();
      }
    });
  }

  constructor(private risorsaService: RisorsaService) {}

  ngOnInit() {
    this.loadRisorse();
    this.loadTipi();
  }

  loadRisorse() {
    this.loading.set(true);
    this.risorsaService.getRisorse().subscribe({
      next: (data) => {
        this.risorse.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Errore caricamento risorse');
        this.loading.set(false);
      }
    });
  }

  loadTipi() {
    this.risorsaService.getTipiRisorsa().subscribe({
      next: (data) => this.tipiRisorsa.set(data)
    });
  }

  // ===== AZIONI STATO =====
  setAttiva(r: Risorsa) {
    this.risorsaService.setAttiva(r.id).subscribe({
      next: (updated) => this.aggiornaRisorsa(updated)
    });
  }

  setManutenzione(r: Risorsa) {
    this.risorsaService.setManutenzione(r.id).subscribe({
      next: (updated) => this.aggiornaRisorsa(updated)
    });
  }

  setDisattiva(r: Risorsa) {
    this.risorsaService.setDisattiva(r.id).subscribe({
      next: (updated) => this.aggiornaRisorsa(updated)
    });
  }

  private aggiornaRisorsa(updated: Risorsa) {
    this.risorse.update(list =>
      list.map(r => r.id === updated.id ? updated : r)
    );
  }

  // ===== HELPERS =====
  getBadgeClass(stato: StatoRisorsa): string {
    const map: Record<StatoRisorsa, string> = {
      ATTIVA: 'badge-green',
      MANUTENZIONE: 'badge-orange',
      DISATTIVA: 'badge-red',
    };
    return map[stato] ?? '';
  }
}