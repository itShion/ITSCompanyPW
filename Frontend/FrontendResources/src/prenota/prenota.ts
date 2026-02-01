import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RisorsaService } from '../app/services/RisorsaService';
import { PrenotaService } from '../app/services/prenota-service';
import { Risorsa } from '../models/Risorsa';
import { PrenotazioneDTO } from '../models/Prenotazione';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prenota',
  templateUrl: './prenota.html',
  imports: [CommonModule,FormsModule],
  styleUrls: ['./prenota.css'],
})
export class Prenota implements OnInit {
  private risorsaService = inject(RisorsaService);
  private prenotaService = inject(PrenotaService);
  private route = inject(ActivatedRoute);
  

  risorsa = signal<Risorsa | null>(null);
  loading = signal(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  dataSelezionata = signal<string>('');
  oraInizio = signal<string>('09:00');
  oraFine = signal<string>('10:00');
  motivo = signal<string>('');

  orariDisponibiliBase = this.generateTimeSlots(8, 18);

  ngOnInit() : void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaRisorsa(id);
    
    const oggi = new Date().toISOString().split('T')[0];
    this.dataSelezionata.set(oggi);
  }

  caricaRisorsa(id: number) {
    this.loading.set(true);
    this.risorsaService.getRisorsa(id).subscribe({
      next: (data) => {
        this.risorsa.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Errore caricamento risorsa');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  private generateTimeSlots(startHour: number, endHour: number): string[] {
    const slots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }
  getOrariFineDisponibili(): string[] {
    const oraInizioVal = this.oraInizio();
    if (!oraInizioVal) return this.orariDisponibiliBase;

    const inizioMinuti = this.timeToMinutes(oraInizioVal);
    
    return this.orariDisponibiliBase.filter(ora => {
      const fineMinuti = this.timeToMinutes(ora);
      return fineMinuti > inizioMinuti && fineMinuti <= inizioMinuti + 240;
    });
  }

  // Converte "HH:MM" in minuti
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Formatta la durata
  getDurata(): string {
    const inizio = this.timeToMinutes(this.oraInizio());
    const fine = this.timeToMinutes(this.oraFine());
    const durataMinuti = fine - inizio;
    
    if (durataMinuti <= 0) return '0h';
    
    const ore = Math.floor(durataMinuti / 60);
    const minuti = durataMinuti % 60;
    
    if (minuti === 0) return `${ore}h`;
    return `${ore}h ${minuti}m`;
  }

  prenota() {
    const risorsaVal = this.risorsa();
    if (!risorsaVal) {
      this.errorMessage.set('Risorsa non trovata');
      return;
    }

    if (!this.dataSelezionata() || !this.oraInizio() || !this.oraFine()) {
      this.errorMessage.set('Compila tutti i campi');
      return;
    }

    const inizioMin = this.timeToMinutes(this.oraInizio());
    const fineMin = this.timeToMinutes(this.oraFine());
    if (fineMin <= inizioMin) {
      this.errorMessage.set('Ora fine deve essere dopo ora inizio');
      return;
    }
    const dataInizio = `${this.dataSelezionata()}T${this.oraInizio()}:00`;
    const dataFine = `${this.dataSelezionata()}T${this.oraFine()}:00`;

    const dto: PrenotazioneDTO = {
      risorsa_id: risorsaVal.id,
      data_inizio: dataInizio,
      data_fine: dataFine,
      motivo: this.motivo() || undefined
    };

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.prenotaService.createPrenotazione(dto).subscribe({
      next: (response) => {
        console.log('Prenotazione creata:', response);
        this.successMessage.set('Prenotazione creata con successo!');
        this.loading.set(false);
        
        // Reset form dopo successo
        setTimeout(() => {
          this.motivo.set('');
          this.oraInizio.set('09:00');
          this.oraFine.set('10:00');
        }, 3000);
      },
      error: (err) => {
        console.error('Errore prenotazione:', err);
        
        // Estrai messaggio d'errore
        let errorMsg = 'Errore durante la prenotazione';
        if (err.error?.error) {
          errorMsg = err.error.error;
        } else if (err.error?.detail) {
          errorMsg = err.error.detail;
        } else if (err.status === 400) {
          errorMsg = 'Dati non validi';
        }
        
        this.errorMessage.set(errorMsg);
        this.loading.set(false);
      }
    });
  }
}