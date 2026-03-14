import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prenotazione } from '../../../../models/Prenotazione';

@Component({
  selector: 'app-supporto-prenotazione-dettaglio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supporto-prenotazioni-dettaglio.html',
  styleUrl: './supporto-prenotazioni-dettaglio.css'
})
export class SupportoPrenotazioneDettaglio {
  @Input() prenotazione: Prenotazione | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() approva = new EventEmitter<number>();
  @Output() rifiuta = new EventEmitter<number>();

  getBadgeClass(stato: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-orange',
      CONFERMATA: 'badge-green',
      ANNULLATA: 'badge-red',
    };
    return map[stato] ?? '';
  }

  getPartecipanteBadge(stato: string): string {
    const map: Record<string, string> = {
      ACCETTATO: 'part-green',
      INVITATO: 'part-orange',
      RIFIUTATO: 'part-red',
    };
    return map[stato] ?? '';
  }

  formatData(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatOra(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onApprova() {
    if (this.prenotazione) this.approva.emit(this.prenotazione.id);
  }

  onRifiuta() {
    if (this.prenotazione) this.rifiuta.emit(this.prenotazione.id);
  }
}