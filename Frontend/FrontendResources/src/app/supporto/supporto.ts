import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  prenotazioniAttive = signal(0);
  prenotazioniPending = signal(0);

  // ===== STATISTICHE PERC =====

  risorseDisponibili = signal(0);
  risorseTotali = signal(0);
  percentualeRisorse = signal(0);

  trendRisorse = computed(() => {
    const p = this.percentualeRisorse();
    if (p >= 80) return { label: `+${p}%`, classe: 'positive' };
    if (p >= 50) return { label: `${p}%`, classe: 'neutral' };
    return { label: `-${p}%`, classe: 'negative' };
  });

  alertPending = computed(() => this.prenotazioniPending() > 5);

  ngOnInit() {
    this.caricaStatistiche();
  }

  caricaStatistiche() {
    this.utilsService.getAllUtenti().subscribe({
      next: (utenti) => {
        this.utentiTotali.set(utenti.length);
      },
      error: (err) => {
        console.error('Errore:', err);
        this.utentiTotali.set(1240);
      }
    });
    this.utilsService.getAllPrenotazioniAttive().subscribe({
      next: (prenotazioni) => {
        this.prenotazioniAttive.set(prenotazioni.length);
        console.log('Prenotazioni attive:', this.prenotazioniAttive());
      }
    });
    this.utilsService.getAllPendingPrenotazioni().subscribe({
      next: (prenotazioni) => {
        this.prenotazioniPending.set(prenotazioni.length);
      }
    });
    this.utilsService.getAllRisorseDisponibili().subscribe({
      next: (risorse) => {
        const totale = risorse.length;
        const disponibili = risorse.filter(r => r.stato === 'ATTIVA').length;
        this.risorseTotali.set(totale);
        this.risorseDisponibili.set(disponibili);
        this.percentualeRisorse.set(
          totale > 0 ? Math.round((disponibili / totale) * 100) : 0
        );
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
