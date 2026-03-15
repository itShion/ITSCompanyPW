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

  // Filtri
  searchQuery = '';
  filtroRuolo = '';

  // Paginazione
  paginaCorrente = signal(1);
  perPagina = 8;

  get utentiFiltrati(): Utente[] {
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
    const start = (this.paginaCorrente() - 1) * this.perPagina + 1;
    const end = Math.min(this.paginaCorrente() * this.perPagina, this.utentiFiltrati.length);
    return `Visualizzati ${start}–${end} di ${this.utentiFiltrati.length} risultati`;
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

  // Popup elimina
  popupEliminaAperto = signal(false);
  utenteSelezionatoId = signal<number | null>(null);

  apriEliminazione(id: number) {
    this.utenteSelezionatoId.set(id);
    this.popupEliminaAperto.set(true);
  }
  chiudiEliminazione() {
    this.popupEliminaAperto.set(false);
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
    return 'Utilizzatore';
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
    this.utenteService.getUtenti().subscribe(data => {
      this.utenti.set(data);
      this.paginaCorrente.set(1);
    });
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

  confermaEliminazione() {
    const id = this.utenteSelezionatoId();
    if (!id) return;
    this.utenteService.eliminaUtente(id).subscribe(() => {
      this.loadUtenti();
      this.chiudiEliminazione();
    });
  }
}
