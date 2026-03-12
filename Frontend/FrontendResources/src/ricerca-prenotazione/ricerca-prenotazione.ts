import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RisorsaService } from '../app/services/RisorsaService';
import { AuthService } from '../app/services/auth.service';
import { Risorsa } from '../models/Risorsa';
import { PrenotaService } from '../app/services/prenota-service';
import { ActivatedRoute } from '@angular/router';
import { PrenotazioneDTO } from '../models/Prenotazione';
import { Router } from '@angular/router';
import { NotificationService } from '../app/services/notification.service';
@Component({
  selector: 'app-ricerca-prenotazione',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ricerca-prenotazione.html',
  styleUrls: ['./ricerca-prenotazione.css'],
})
export class RicercaPrenotazione implements OnInit {

  private risorsaService = inject(RisorsaService);
  private authService = inject(AuthService);
  private prenotaService = inject(PrenotaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notifiche = inject(NotificationService);



  // ===== DATA =====
  risorse = signal<Risorsa[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // ===== MODAL =====
  showModal = signal(false);
  prenotazioneSuccesso = signal(false); 
  selectedRisorsa = signal<Risorsa | null>(null);
  utente = signal(this.authService.getCurrentUser());
  oggi = signal<string>(new Date().toISOString().split('T')[0]);

  dataSelezionata = signal<string>('');
  oraInizio = signal<string>('09:00');
  oraFine = signal<string>('10:00');
  motivo = signal<string>('');
  orariDisponibiliBase = this.generateTimeSlots(8, 18);

  // ===== INIT =====
  ngOnInit(): void {
    this.loadRisorse();
    const oggi = new Date().toISOString().split('T')[0];
    this.dataSelezionata.set(oggi);
  }

  loadRisorse() {
    this.loading.set(true);
    this.risorsaService.getRisorse().subscribe({
      next: (data) => {
        this.risorse.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // ===== MODAL ACTIONS =====
  openPrenotaModal(r: Risorsa) {
    if (!this.isDisponibile(r)) return;

    this.selectedRisorsa.set(r);
    this.oraInizio.set('09:00');
    this.oraFine.set('10:00');
    this.motivo.set('');
    this.errorMessage.set('');
    this.successMessage.set('');

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  // ===== MODAL SUCCESSO =====
  prenotazioneEffettuata() {
    return this.prenotazioneSuccesso();
  }

  closeSuccessModal() {
    this.prenotazioneSuccesso.set(false);
  }

  goToMiePrenotazioni() {
   this.router.navigate(['/mie-prenotazioni']);
  }
  

  confermaPrenotazione() {
    const risorsaVal = this.selectedRisorsa();
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
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.prenotazioneSuccesso.set(true);
        this.notifiche.successo('Prenotazione creata con successo!');
        this.motivo.set('');
        this.oraInizio.set('09:00');
        this.oraFine.set('10:00');
      },
      error: (err) => {
        this.loading.set(false);
    
        // Se il backend manda { errore: true, codice: 400, dettaglio: "..." }
        if (err.error && err.error.dettaglio) {
          this.errorMessage.set(err.error.dettaglio);
        } else {
          this.errorMessage.set('Errore sconosciuto');
        }
      }
    });
  }

  // ===== HELPERS =====
  private generateTimeSlots(startHour: number, endHour: number): string[] {
    const slots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getOrariFineDisponibili(): string[] {
    const oraInizioVal = this.oraInizio();
    if (!oraInizioVal) return this.orariDisponibiliBase;

    const inizioMinuti = this.timeToMinutes(oraInizioVal);

    const disponibili = this.orariDisponibiliBase.filter(ora => {
      const fineMinuti = this.timeToMinutes(ora);
      return fineMinuti > inizioMinuti && fineMinuti <= inizioMinuti + 240;
    });

    if (!disponibili.includes(this.oraFine())) {
      this.oraFine.set(disponibili[0]);
    }

    return disponibili;
  }

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

  isDisponibile(r: Risorsa): boolean {
    if (!r.attiva) return false;

    const giorno = new Date(this.dataSelezionata()).getDay(); // 0 = domenica ... 6 = sabato
    switch (giorno) {
      case 0: return r.domenica;
      case 1: return r.lunedi;
      case 2: return r.martedi;
      case 3: return r.mercoledi;
      case 4: return r.giovedi;
      case 5: return r.venerdi;
      case 6: return r.sabato;
      default: return false;
    }
  }


}