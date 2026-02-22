import { Component, inject, OnInit, signal } from '@angular/core';
import { SupportoSidebar } from './supporto-sidebar/supporto-sidebar';
import { SupportoNewRisorsaComponent } from './supporto-risorse/supporto-new-risorsa/supporto-new-risorsa';
import { RisorsaService } from '../services/RisorsaService';
import { CommonModule } from '@angular/common';
import { RisorsaCreate } from '../../models/Risorsa';
import { UtilsReportService } from '../services/utils-report-service';

@Component({
  selector: 'app-supporto',
  imports: [SupportoNewRisorsaComponent, CommonModule],
  templateUrl: './supporto.html',
  styleUrl: './supporto.css',
})
export class Supporto implements OnInit {
  isNewRisorsaModalOpen = false;
  utilsService = inject(UtilsReportService);

  utentiTotali = signal(0);

  ngOnInit() {
    this.caricaStatistiche();
  }

  caricaStatistiche() {
    this.utilsService.getAllUtenti().subscribe({
      next: (utenti) => {
        this.utentiTotali.set(utenti.length);  // <-- AGGIORNA IL SIGNAL
        console.log('Utenti totali:', this.utentiTotali());
      },
      error: (err) => {
        console.error('Errore:', err);
        this.utentiTotali.set(1240);
      }
    });
  }

  constructor(private risorsaService: RisorsaService) { }


  openNewRisorsaModal() {
    this.isNewRisorsaModalOpen = true;
  }

  closeNewRisorsaModal() {
    this.isNewRisorsaModalOpen = false;
  }

  saveNewRisorsa(risorsaData: RisorsaCreate) {
    console.log('Dati da inviare al backend:', risorsaData);

    this.risorsaService.createRisorsa(risorsaData).subscribe({
      next: (response) => {
        console.log('Risorsa creata:', response);
        alert('Risorsa creata con successo!');
        this.closeNewRisorsaModal();
      },
      error: (error) => {
        console.error('Errore:', error);
        alert('Errore nella creazione');
      }
    });
  }
}
