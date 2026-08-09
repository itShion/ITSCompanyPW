import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notifica } from '../services/notification.service';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let n of notifiche"
        class="toast toast--{{ n.tipo }}"
        (click)="rimuovi(n)">
        {{ n.messaggio }}
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }
    .toast {
      padding: .75rem 1.25rem;
      border-radius: 10px;
      color: white;
      cursor: pointer;
      min-width: 280px;
      font-size: .9rem;
      font-weight: 500;
      font-family: "Inter", "Segoe UI", sans-serif;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
      animation: fadeIn .2s ease;
    }
    .toast--successo { background: #16a34a; }
    .toast--errore   { background: #dc2626; }
    .toast--info     { background: #006aff; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
  `]
})
export class ToastComponent implements OnInit {
  notifiche: Notifica[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifiche$.subscribe(n => {
      // Evita di impilare piu' volte lo stesso messaggio (es. piu' chiamate
      // API in parallelo che falliscono tutte con 401 alla scadenza sessione)
      const giaMostrato = this.notifiche.some(x => x.tipo === n.tipo && x.messaggio === n.messaggio);
      if (giaMostrato) return;

      this.notifiche.push(n);
      setTimeout(() => this.rimuovi(n), 4000);
    });
  }

  rimuovi(n: Notifica) {
    this.notifiche = this.notifiche.filter(x => x !== n);
  }
}