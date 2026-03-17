import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Prenotazione, Partecipante } from '../models/Prenotazione';
import { PrenotaService } from '../app/services/prenota-service';
import { AuthService } from '../app/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mie-prenotazioni',
  standalone: true,
  imports: [CommonModule, NgClass , FormsModule],
  templateUrl: './mie-prenotazioni.html',
  styleUrls: ['./mie-prenotazioni.css'],
})
export class MiePrenotazioni implements OnInit {
  prenotazioni = signal<Prenotazione[]>([]);
  loading = signal(true);

  private prenotaService = inject(PrenotaService);

  confermate = signal(0);
  inAttesa = signal(0);
  annullate = signal(0);
  feedbackMessage = signal<string>('');
  feedbackTipo = signal<'success' | 'error'>('success');

  cercaNome = signal('');
  filtroStato = signal('');
  filtroData = signal('');

  mostraStorico = signal(false);

  // ===== MODAL ANNULLA =====
  showAnnullaModal = signal(false);
  prenotazioneSelezionata = signal<Prenotazione | null>(null);

  // ===== MODAL INVITO =====
  showInvitoModal = signal(false);
  prenotazioneInvito = signal<Prenotazione | null>(null);

  // ==== MODAL DETTAGLIO =====

  showDettaglioModal = signal(false);
  prenotazioneDettaglio = signal<Prenotazione | null>(null);
  motivoInput = '';
  loadingMotivo = signal(false);

  ngOnInit(): void {
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni() {
    this.loading.set(true);
    this.prenotaService.getMiePrenotazioni().subscribe({
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

  // ===== ANNULLA =====
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
      next: (updated) => {
        this.aggiornaPrenotazione(updated);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Errore annullamento:', err);
        this.loading.set(false);
      }
    });
  }

  // ===== STORICO =====

  toggleStorico() {
    this.mostraStorico.update(v => !v);
    if (this.mostraStorico()) {
      this.prenotaService.getPrenotazioniStoriche().subscribe({
        next: (data) => {
          this.prenotazioni.set(data);
          this.aggiornaContatori(data);
        }
      });
    } else {
      this.caricaPrenotazioni();
    }
  }

  // ===== INVITO =====
  openInvitoModal(p: Prenotazione) {
    this.prenotazioneInvito.set(p);
    this.showInvitoModal.set(true);
  }

  closeInvitoModal() {
    this.showInvitoModal.set(false);
    this.prenotazioneInvito.set(null);
  }

  accettaInvito() {
    const p = this.prenotazioneInvito();
    if (!p) return;
    this.prenotaService.accettaPartecipazione(p.id).subscribe({
      next: (updated) => {
        this.aggiornaPrenotazione(updated);
        this.closeInvitoModal();
        this.feedbackTipo.set('success');
        this.feedbackMessage.set('✓ Hai accettato l\'invito!');
        setTimeout(() => this.feedbackMessage.set(''), 3000);
      },
      error: (err) => console.error('Errore accettazione:', err)
    });
  }


  paginaCorrente = signal(1);
  perPagina = 5;
  get totalPages() {
    return Math.ceil(this.prenotazioniFiltrate().length / this.perPagina);
  }
  prenotazioniPaginate = computed(() => {
    const start = (this.paginaCorrente() - 1) * this.perPagina;
    return this.prenotazioniFiltrate().slice(start, start + this.perPagina);
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

  rifiutaInvito() {
    const p = this.prenotazioneInvito();
    if (!p) return;
    this.prenotaService.rifiutaPartecipazione(p.id).subscribe({
      next: (updated) => {
        this.aggiornaPrenotazione(updated);
        this.closeInvitoModal();
        this.feedbackTipo.set('error');
        this.feedbackMessage.set('Hai rifiutato l\'invito.');
        setTimeout(() => this.feedbackMessage.set(''), 3000);
      },
      error: (err) => console.error('Errore rifiuto:', err)
    });
  }

  // ===== DETTAGLIO ====

  openDettaglioModal(p: Prenotazione) {
  this.prenotazioneDettaglio.set(p);
  this.motivoInput = p.motivo ?? '';
  this.showDettaglioModal.set(true);
  }

  closeDettaglioModal() {
    this.showDettaglioModal.set(false);
    this.prenotazioneDettaglio.set(null);
  }

  salvaMotivo() {
    const p = this.prenotazioneDettaglio();
    if (!p) return;
    this.loadingMotivo.set(true);
    this.prenotaService.modificaMotivo(p.id, this.motivoInput).subscribe({
      next: (updated) => {
        this.aggiornaPrenotazione(updated);
        this.prenotazioneDettaglio.set(updated);
        this.loadingMotivo.set(false);
        this.feedbackTipo.set('success');
        this.feedbackMessage.set('✓ Motivo aggiornato');
        setTimeout(() => this.feedbackMessage.set(''), 3000);
      },
      error: () => {
        this.loadingMotivo.set(false);
        this.feedbackTipo.set('error');
        this.feedbackMessage.set('Errore nel salvataggio');
        setTimeout(() => this.feedbackMessage.set(''), 3000);
      }
    });
  }

  // ===== HELPERS =====
  authService = inject(AuthService)
  currentUser = toSignal(this.authService.currentUser$);
  isInvitato(p: Prenotazione): boolean {
    return p.partecipanti?.some(
      part => part.username === this.currentUser()?.username && part.stato === 'INVITATO'
    ) ?? false;
  }

  private aggiornaPrenotazione(updated: Prenotazione) {
    const list = this.prenotazioni().map(pr =>
      pr.id === updated.id ? updated : pr
    );
    this.prenotazioni.set(list);
    this.aggiornaContatori(list);
  }

  formatOra(dateStr: string): string {
    return dateStr.substring(11, 16);
  }

  formatData(dateStr: string): string {
    const [year, month, day] = dateStr.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }





 prenotazioniFiltrate = computed(() => {
  const nome = this.cercaNome().toLowerCase().trim();
  const stato = this.filtroStato();
  const data = this.filtroData();
  return this.prenotazioni().filter(p => {
    const matchesNome = p.risorsa.nome.toLowerCase().includes(nome);
    const matchesStato = stato ? p.stato === stato : true;
    const matchData = !data || p.data_inizio.startsWith(data);    return matchesNome && matchesStato && matchData;
  });});


  onCercaNome(val: string) {
  this.cercaNome.set(val);
  this.paginaCorrente.set(1);
}

onFiltroStato(val: string) {
  this.filtroStato.set(val);
  this.paginaCorrente.set(1);
}

onFiltroData(val: string) {
  this.filtroData.set(val);
  this.paginaCorrente.set(1);
}

resetFiltri() {
  this.cercaNome.set('');
  this.filtroStato.set('');
  this.filtroData.set('');
  this.paginaCorrente.set(1);
}
}
