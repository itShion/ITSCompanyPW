import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Postazione } from '../postazione/postazione';
import { TabellaHttpService } from '../servizi/tabella';

@Component({
  selector: 'app-prenotazionitab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prenotazionitab.html',
  styleUrl: './prenotazionitab.css',
})
export class Prenotazionitab implements OnInit {

  tabella: Postazione[] = [];
  tabellaFiltrati: Postazione[] = [];

  filtrotipo: string = '';
  selectAll = false;
  selectedItems = 0;

  indicePagina = 1;
  elementiPagina = 10;

  postazioneId: string = '';
  postazioneNumero: string = '';
  postazioneTipo: string = '';

  cancelledUser: string | null = null;

  private originalIndexes = new Map<string, number>();

  constructor(private userService: TabellaHttpService) {}

  ngOnInit(): void {
    this.tabella = [
      { id: 'postazione1', numeroServizio: '001', tipoServizio: 'Scrivania', favourite: false },
      { id: 'postazione2', numeroServizio: '002', tipoServizio: 'Scrivania', favourite: false },
      { id: 'postazione3', numeroServizio: '003', tipoServizio: 'Scrivania', favourite: false },
      { id: 'salariunioni1', numeroServizio: '101', tipoServizio: 'Sala Riunioni', favourite: false },
      { id: 'salariunioni2', numeroServizio: '102', tipoServizio: 'Sala Riunioni', favourite: false },
      { id: 'stampante3d', numeroServizio: '201', tipoServizio: 'Stampante 3D', favourite: false }
    ];

    this.inizio(); // 👈 inizializza correttamente la vista
  }

  filtraTabella() {
    this.indicePagina = 1;
    this.tabellaFiltrati = this.tabella.filter(p =>
      p.tipoServizio.toLowerCase().includes(this.filtrotipo.toLowerCase())
    ).slice(0, this.elementiPagina);
  }

  azzeraFiltro() {
    this.filtrotipo = '';
    this.inizio();
  }

  preferiti(id: string) {
    const index = this.tabella.findIndex(p => p.id === id);
    const p = this.tabella[index];
    if (!p) return;

    const wasFavorite = p.favourite;
    p.favourite = !p.favourite;
    this.tabella.splice(index, 1);

    if (p.favourite) {
      if (!wasFavorite) this.originalIndexes.set(p.id, index);
      this.tabella.unshift(p);
    } else {
      const originalIndex = this.originalIndexes.get(p.id) ?? this.tabella.length;
      this.tabella.splice(originalIndex, 0, p);
      this.originalIndexes.delete(p.id);
    }

    this.inizio();
  }

  toggleAll() {
    this.tabella.forEach(i => i.selected = this.selectAll);
    this.countSelected();
  }

  checkIfAllSelected() {
    this.selectAll = this.tabella.every(i => i.selected);
    this.countSelected();
  }

  countSelected() {
    this.selectedItems = this.tabella.filter(p => p.selected).length;
  }

  modificaPostazione(id: string) {
    const p = this.tabella.find(p => p.id === id);
    if (!p) return;

    this.postazioneId = p.id;
    this.postazioneNumero = p.numeroServizio;
    this.postazioneTipo = p.tipoServizio;
  }

  cancelUser(id: string) {
    this.cancelledUser = id;
  }

  confirmCancel() {
    if (!this.cancelledUser) return;
    this.tabella = this.tabella.filter(p => p.id !== this.cancelledUser);
    this.cancelledUser = null;
    this.inizio();
  }

  salvaEdit() {
    const p = this.tabella.find(p => p.id === this.postazioneId);
    if (!p) return;

    p.numeroServizio = this.postazioneNumero;
    p.tipoServizio = this.postazioneTipo;
    this.postazioneId = '';
    this.inizio();
  }

  avanti() {
    if (this.indicePagina * this.elementiPagina >= this.tabella.length) return;
    this.indicePagina++;
    this.aggiornaPagina();
  }

  indietro() {
    if (this.indicePagina === 1) return;
    this.indicePagina--;
    this.aggiornaPagina();
  }

  inizio() {
    this.indicePagina = 1;
    this.aggiornaPagina();
  }

  fine() {
    this.indicePagina = Math.ceil(this.tabella.length / this.elementiPagina);
    this.aggiornaPagina();
  }

prenotaPostazione(id: string) {
  const p = this.tabella.find(p => p.id === id);
  if (!p) return;

  if (
    !p.inPrenotazione &&
    (p.tipoServizio === 'Sala Riunioni' || p.tipoServizio === 'Stampante 3D')
  ) {
    p.inPrenotazione = true;
    return;
  }

  if (
    (p.tipoServizio === 'Sala Riunioni' || p.tipoServizio === 'Stampante 3D') &&
    !p.orario
  ) {
    alert('Seleziona un orario');
    return;
  }
  p.tipoOriginale = p.tipoServizio;

  p.prenotata = true;
  p.inPrenotazione = false;
  p.tipoServizio = 'Servizio prenotato';


  this.aggiornaPagina();
}



cancellaPrenotazione(id: string) {
  const p = this.tabella.find(p => p.id === id);
  if (!p) return;

  p.prenotata = false;
  p.inPrenotazione = false;
  p.tipoServizio = p.tipoOriginale ?? p.tipoServizio;
  p.tipoOriginale = undefined;
  p.orario = undefined;

  this.aggiornaPagina();
}



  private aggiornaPagina() {
    const start = (this.indicePagina - 1) * this.elementiPagina;
    const end = this.indicePagina * this.elementiPagina;
    this.tabellaFiltrati = this.tabella.slice(start, end);
  }
}
