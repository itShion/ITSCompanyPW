import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Prenotazione, Partecipante } from '../models/Prenotazione';
import { PrenotaService } from '../app/services/prenota-service';
import { AuthService } from '../app/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

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

  confermate = signal(0);
  inAttesa = signal(0);
  annullate = signal(0);
  feedbackMessage = signal<string>('');
  feedbackTipo = signal<'success' | 'error'>('success');

  mostraStorico = signal(false);

  // ===== MODAL ANNULLA =====
  showAnnullaModal = signal(false);
  prenotazioneSelezionata = signal<Prenotazione | null>(null);

  // ===== MODAL INVITO =====
  showInvitoModal = signal(false);
  prenotazioneInvito = signal<Prenotazione | null>(null);

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


}