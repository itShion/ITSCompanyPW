import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../../services/utente.service';
import { Utente, NuovoUtenteDTO } from '../../../models/Utente';

@Component({
  selector: 'app-supporto-utenti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supporto-utenti.html',
  styleUrl: './supporto-utenti.css',
})
export class SupportoUtenti implements OnInit {

  utenti = signal<Utente[]>([]);
  filtroStato: 'attivi' | 'disabilitati' | 'tutti' = 'attivi';

  // Filtri
  searchQuery = '';
  filtroRuolo = '';

  // Paginazione
  paginaCorrente = signal(1);
  perPagina = 5;

  get utentiFiltrati(): Utente[] {
    //console.log('Ruoli utenti:', this.utenti().map(u => u.ruolo));
    return this.utenti().filter(u => {
      const matchSearch =
        !this.searchQuery ||
        u.username.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchRuolo =
        !this.filtroRuolo ||
        u.ruolo.toLowerCase() === this.filtroRuolo.toLowerCase();
      return matchSearch && matchRuolo;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.utentiFiltrati.length / this.perPagina);
  }

  get utentiPaginati(): Utente[] {
    const start = (this.paginaCorrente() - 1) * this.perPagina;
    return this.utentiFiltrati.slice(start, start + this.perPagina);
  }

  get paginaInfo(): string {
    const total = this.utentiFiltrati.length;

    if (total === 0)
      return 'Nessun risultato';

    const start = (this.paginaCorrente() - 1) * this.perPagina + 1;
    const end = Math.min(this.paginaCorrente() * this.perPagina, total);
    return `Visualizzati ${start}–${end} di ${total} risultati`;
  }

  paginaPrecedente() {
    if (this.paginaCorrente() > 1) this.paginaCorrente.update(p => p - 1);
  }

  paginaSuccessiva() {
    if (this.paginaCorrente() < this.totalPages) this.paginaCorrente.update(p => p + 1);
  }

  onFilterChange() {
    this.paginaCorrente.set(1);
  }

  cambiaFiltroStato() {
    if (this.filtroStato === 'attivi') this.filtroStato = 'disabilitati';
    else if (this.filtroStato === 'disabilitati') this.filtroStato = 'tutti';
    else this.filtroStato = 'attivi';
    this.paginaCorrente.set(1);
    this.loadUtenti();
  }

  // Modal aggiungi utente
  modalAperto = signal(false);
  nuovoUtente: NuovoUtenteDTO = {
    username: '',
    ruolo: '',
    email: '',
    password: ''
  };

  openModal() { this.modalAperto.set(true); }
  closeModal() {
    this.modalAperto.set(false);
    this.nuovoUtente = {
      username: '',
      ruolo: '',
      email: '',
      password: ''
    };
  }

  // Modal modifica
  modalModificaAperto = signal(false);
  utenteInModifica: Partial<Utente> & { id?: number } = {};

  apriModifica(utente: Utente) {
    this.utenteInModifica = { ...utente };
    this.modalModificaAperto.set(true);
  }
  chiudiModifica() {
    this.modalModificaAperto.set(false);
    this.utenteInModifica = {};
  }

  // Popup disabilita
  popupDisabilitaAperto = signal(false);
  utenteSelezionatoId = signal<number | null>(null);

  apriDisabilitazione(id: number) {
    this.utenteSelezionatoId.set(id);
    this.popupDisabilitaAperto.set(true);
  }
  chiudiDisabilitazione() {
    this.popupDisabilitaAperto.set(false);
    this.utenteSelezionatoId.set(null);
  }

  // Popup riabilita
  popupRiabilitaAperto = signal(false);

  apriRiabilitazione(id: number) {
    this.utenteSelezionatoId.set(id);
    this.popupRiabilitaAperto.set(true);
  }
  chiudiRiabilitazione() {
    this.popupRiabilitaAperto.set(false);
    this.utenteSelezionatoId.set(null);
  }

  // Badge ruolo
  getBadgeClass(ruolo: string): string {
    const r = ruolo?.toLowerCase();
    if (r === 'admin') return 'badge-admin';
    if (r === 'responsabile') return 'badge-resp';
    return 'badge-user';
  }

  getBadgeLabel(ruolo: string): string {
    const r = ruolo?.toLowerCase();
    if (r === 'admin') return 'Amministratore';
    if (r === 'responsabile') return 'Responsabile';
    return 'Dipendente';
  }

  // Colore avatar
  getAvatarClass(username: string): string {
    const colors = ['av-blue', 'av-purple', 'av-green', 'av-orange', 'av-pink'];
    const index = (username?.charCodeAt(0) ?? 0) % colors.length;
    return colors[index];
  }

  constructor(private utenteService: UtenteService) {}

  ngOnInit(): void {
    this.loadUtenti();
  }

  loadUtenti() {
    if (this.filtroStato === 'disabilitati') {
      this.utenteService.getUtentiDisabilitati().subscribe((data: Utente[]) => {
        this.utenti.set(data); this.paginaCorrente.set(1);
      });
    } else if (this.filtroStato === 'tutti') {
      this.utenteService.getAllUtenti().subscribe((data: Utente[]) => {
        this.utenti.set(data); this.paginaCorrente.set(1);
      });
    } else {
      this.utenteService.getUtenti().subscribe((data: Utente[]) => {
        this.utenti.set(data); this.paginaCorrente.set(1);
      });
    }
  }

  creaUtente() {
    this.utenteService.creaUtente(this.nuovoUtente).subscribe(() => {
      this.loadUtenti();
      this.closeModal();
    });
  }

  salvaModifica() {
    const id = this.utenteInModifica.id;
    if (!id) return;
    this.utenteService.modificaUtente(id, this.utenteInModifica).subscribe(() => {
      this.loadUtenti();
      this.chiudiModifica();
    });
  }

  confermaDisabilitazione() {
    const id = this.utenteSelezionatoId();
    if (!id) return;
    this.utenteService.disabilitaUtente(id).subscribe(() => {
      this.loadUtenti();
      this.chiudiDisabilitazione();
    });
  }

  confermaRiabilitazione() {
    const id = this.utenteSelezionatoId();
    if (!id) return;
    this.utenteService.riabilitaUtente(id).subscribe(() => {
      this.loadUtenti();
      this.chiudiRiabilitazione();
    });
  }
}
