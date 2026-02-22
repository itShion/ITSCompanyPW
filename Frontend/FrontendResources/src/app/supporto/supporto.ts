import { Component } from '@angular/core';
import { SupportoSidebar } from './supporto-sidebar/supporto-sidebar';
import { SupportoNewRisorsaComponent } from './supporto-risorse/supporto-new-risorsa/supporto-new-risorsa';
import { RisorsaService } from '../services/RisorsaService';
import { CommonModule } from '@angular/common';
import { RisorsaCreate } from '../../models/Risorsa';

@Component({
  selector: 'app-supporto',
  imports: [SupportoNewRisorsaComponent, CommonModule],
  templateUrl: './supporto.html',
  styleUrl: './supporto.css',
})
export class Supporto {
  isNewRisorsaModalOpen = false;

  constructor(private risorsaService: RisorsaService) {}

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
