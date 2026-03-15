import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivityLog } from '../../../models/ActivityLog';
import { UtilsReportService } from '../../services/utils-report-service';

@Component({
  selector: 'app-supporto-activitylog',
  imports: [],
  templateUrl: './supporto-activitylog.html',
  styleUrl: './supporto-activitylog.css',
})
export class SupportoActivitylog implements OnInit, OnDestroy {

  logs = signal<ActivityLog[]>([]);
  loading = signal(true);
  private pollingInterval: any;

  constructor(private utilsService: UtilsReportService) {}

  ngOnInit() {
    this.loadLogs();
    this.pollingInterval = setInterval(() => this.loadLogs(), 30000);
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval);
  }

  loadLogs() {
    this.utilsService.getActivityLogs().subscribe({
      next: (data) => {
        this.logs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Errore caricamento log:', err);
        this.loading.set(false);
      }
    });
  }

  getIcon(azione: string): string {
    const map: Record<string, string> = {
      CREATA: '🟢',
      CONFERMATA: '🔵',
      ANNULLATA: '🔴',
      RIFIUTATA: '🔴',
      PARTECIPANTE_RIFIUTATO: '🟠',
      PARTECIPANTE_ACCETTATO: '🟢',
    };
    return map[azione] ?? '⚪';
  }

  formatOra(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatData(dateStr: string): string {
    const date = new Date(dateStr);
    const oggi = new Date();
    const domani = new Date();
    domani.setDate(oggi.getDate() + 1);

    if (date.toDateString() === oggi.toDateString()) return 'Oggi';
    if (date.toDateString() === domani.toDateString()) return 'Domani';

    return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
  }

  formatOrario(inizio: string, fine: string): string {
    const oraInizio = new Date(inizio).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const oraFine = new Date(fine).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return `dalle ${oraInizio} alle ${oraFine}`;
  }
}
