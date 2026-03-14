import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RisorsaService } from '../app/services/RisorsaService';
import { AuthService } from '../app/services/auth.service';
import { Risorsa } from '../models/Risorsa';
import { PrenotaService } from '../app/services/prenota-service';
import { ActivatedRoute } from '@angular/router';
import { PrenotazioneDTO } from '../models/Prenotazione';
import { Router } from '@angular/router';
import { UtilsReportService } from '../app/services/utils-report-service';
import { Utente } from '../models/Utente';
import { toSignal } from '@angular/core/rxjs-interop';

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
  private utilsService = inject(UtilsReportService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


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

  // ===== PARTECIPANTI =====
  tuttiGliUtenti = signal<Utente[]>([]);
  partecipantiSelezionati = signal<Utente[]>([]);
  searchQuery = signal<string>('');
  showDropdown = signal<boolean>(false);

  currentUser = toSignal(this.authService.currentUser$);

  suggerimenti = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const selezionati = this.partecipantiSelezionati();
    const currentUser = this.currentUser();

    if (!query || query.length < 2) return [];

    return this.tuttiGliUtenti().filter(u =>
      u.username.toLowerCase().includes(query) &&
      !selezionati.find(s => s.id === u.id) &&  // già selezionato
      u.id !== currentUser?.id                   // non se stesso
    ).slice(0, 5); // max 5 suggerimenti
  });

  // ===== INIT =====
  ngOnInit(): void {
    this.loadRisorse();
    const oggi = new Date().toISOString().split('T')[0];
    this.dataSelezionata.set(oggi);
    this.utilsService.getAllUtenti().subscribe(utenti => {
      this.tuttiGliUtenti.set(utenti);
    });
  }

  loadRisorse() {
    this.loading.set(true);
    this.risorsaService.getRisorse().subscribe({
      next: (data) => {
        this.risorse.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set("Errore caricamento risorse");
        this.loading.set(false);
      }
    });
  }

  // ===== MODAL ACTIONS =====
  openPrenotaModal(r: Risorsa) {
    if (!this.isDisponibile(r)) return;

    this.selectedRisorsa.set(r);

    // Setta oraInizio all'apertura della risorsa
    const oraApertura = r.orario_apertura.substring(0, 5); // "08:00"
    this.oraInizio.set(oraApertura);

    const inizioMinuti = this.timeToMinutes(oraApertura);
    const disponibili = this.orariDisponibiliBase.filter(ora => {
      const fineMinuti = this.timeToMinutes(ora);
      return fineMinuti > inizioMinuti && fineMinuti <= inizioMinuti + 480;
    });
    this.oraFine.set(disponibili[0] ?? '');

    this.motivo.set('');
    this.errorMessage.set('');
    this.successMessage.set('');
    this.partecipantiSelezionati.set([]);
    this.searchQuery.set('');
    this.showDropdown.set(false);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  // ===== PARTECIPANTI ACTIONS =====
  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.showDropdown.set(val.length >= 2);
  }

  selezionaPartecipante(utente: Utente) {
    const risorsa = this.selectedRisorsa();

    // Controllo capienza: +1 per il creatore
    if (risorsa && this.partecipantiSelezionati().length + 1 >= risorsa.capacita) {
      this.errorMessage.set(`Capacità massima raggiunta (${risorsa.capacita} persone)`);
      return;
    }

    this.partecipantiSelezionati.update(list => [...list, utente]);
    this.searchQuery.set('');
    this.showDropdown.set(false);
    this.errorMessage.set('');
  }

  rimuoviPartecipante(utente: Utente) {
    this.partecipantiSelezionati.update(list => list.filter(u => u.id !== utente.id));
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

    const offset = new Date().getTimezoneOffset();
    const offsetOre = -offset / 60;
    const offsetStr = offsetOre >= 0
      ? `+${offsetOre.toString().padStart(2, '0')}:00`
      : `-${Math.abs(offsetOre).toString().padStart(2, '0')}:00`;

    const dataInizio = `${this.dataSelezionata()}T${this.oraInizio()}:00`;
    const dataFine = `${this.dataSelezionata()}T${this.oraFine()}:00`;

    const dto: PrenotazioneDTO = {
      risorsa_id: risorsaVal.id,
      data_inizio: dataInizio,
      data_fine: dataFine,
      motivo: this.motivo() || undefined,
      ...(risorsaVal.capacita > 1 && {
        partecipanti_ids: this.partecipantiSelezionati().map(u => u.id)
      })
    };

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.prenotaService.createPrenotazione(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.prenotazioneSuccesso.set(true);

        setTimeout(() => {
          this.motivo.set('');
          this.oraInizio.set('09:00');
          this.oraFine.set('10:00');
          this.partecipantiSelezionati.set([]);
        }, 3000);
      },
      error: (err) => {
        console.error('Errore prenotazione:', err);
        let errorMsg = 'Errore durante la prenotazione';
        if (err.error?.error) errorMsg = err.error.error;
        else if (err.error?.detail) errorMsg = err.error.detail;
        else if (typeof err.error === 'string') errorMsg = err.error;
        this.errorMessage.set(errorMsg);
        this.loading.set(false);
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
      return fineMinuti > inizioMinuti && fineMinuti <= inizioMinuti + 480; // 8 ore max
    });

    if (disponibili.length > 0 && !disponibili.includes(this.oraFine())) {
      this.oraFine.set(disponibili[0]);
    }

    return disponibili;
  }

  onOraInizioChange(value: string) {
    this.oraInizio.set(value);
    const inizioMinuti = this.timeToMinutes(value);
    const disponibili = this.orariDisponibiliBase.filter(ora => {
      const fineMinuti = this.timeToMinutes(ora);
      return fineMinuti > inizioMinuti && fineMinuti <= inizioMinuti + 480;
    });
    if (disponibili.length > 0) {
      this.oraFine.set(disponibili[0]);
    }
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
    const giorno = new Date(this.dataSelezionata() + 'T12:00:00').getDay();
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