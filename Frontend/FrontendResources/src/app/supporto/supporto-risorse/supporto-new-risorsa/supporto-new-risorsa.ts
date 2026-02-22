import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { RisorsaService } from '../../../services/RisorsaService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoRisorsa } from '../../../../models/TipoRisorsa';
import { RisorsaCreate } from '../../../../models/Risorsa';

@Component({
  selector: 'app-supporto-new-risorsa',
  imports: [FormsModule, CommonModule],
  templateUrl: './supporto-new-risorsa.html',
  styleUrls: ['./supporto-new-risorsa.css']
})
export class SupportoNewRisorsaComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<RisorsaCreate>(); 

  nuovaRisorsa = {
    nome: '',
    descrizione: '',
    capacita: 1,
    tipoObj: null as TipoRisorsa | null,
    orario_apertura: '08:00',
    orario_chiusura: '18:00',
    lunedi: true,
    martedi: true,
    mercoledi: true,
    giovedi: true,
    venerdi: true,
    sabato: false,
    domenica: false,
    attiva: true
  };

  tipiRisorsa: TipoRisorsa[] = [];

  constructor(private risorsaService: RisorsaService) {}

  ngOnInit() {
    this.caricaTipiRisorsa();
  }

  caricaTipiRisorsa() {
    this.risorsaService.getTipiRisorsa().subscribe({
      next: (data) => {
        this.tipiRisorsa = data;
      },
      error: (err) => {
        console.error('Errore nel caricare i tipi', err);
        this.tipiRisorsa = [
          { id: 1, nome: 'Sala Riunioni', descrizione: 'spazio prenotabile per riunioni e incontri' },
          { id: 2, nome: 'Attrezzatura', descrizione: 'strumenti e dispositivi prenotabili' },
          { id: 3, nome: 'Postazione', descrizione: 'spazio di lavoro individuale' }
        ];
      }
    });
  }

  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }

  onSubmit() {
    if (!this.nuovaRisorsa.nome || !this.nuovaRisorsa.descrizione || !this.nuovaRisorsa.tipoObj) {
      alert('Compila nome, descrizione e tipo!');
      return;
    }

    const risorsaDaCreare: RisorsaCreate = {
      nome: this.nuovaRisorsa.nome,
      descrizione: this.nuovaRisorsa.descrizione,
      capacita: this.nuovaRisorsa.capacita,
      tipo: this.nuovaRisorsa.tipoObj.id,
      orario_apertura: this.nuovaRisorsa.orario_apertura + ':00',
      orario_chiusura: this.nuovaRisorsa.orario_chiusura + ':00',
      lunedi: this.nuovaRisorsa.lunedi,
      martedi: this.nuovaRisorsa.martedi,
      mercoledi: this.nuovaRisorsa.mercoledi,
      giovedi: this.nuovaRisorsa.giovedi,
      venerdi: this.nuovaRisorsa.venerdi,
      sabato: this.nuovaRisorsa.sabato,
      domenica: this.nuovaRisorsa.domenica,
      attiva: this.nuovaRisorsa.attiva
    };

    this.save.emit(risorsaDaCreare);
    this.closeModal();
    
    this.nuovaRisorsa = {
      nome: '',
      descrizione: '',
      capacita: 1,
      tipoObj: null,
      orario_apertura: '08:00',
      orario_chiusura: '18:00',
      lunedi: true,
      martedi: true,
      mercoledi: true,
      giovedi: true,
      venerdi: true,
      sabato: false,
      domenica: false,
      attiva: true
    };
  }

  compareTipi(t1: TipoRisorsa, t2: TipoRisorsa) {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }
}