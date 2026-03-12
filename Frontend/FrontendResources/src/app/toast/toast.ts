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
      border-radius: 6px;
      color: white;
      cursor: pointer;
      min-width: 280px;
      font-size: .9rem;
      box-shadow: 0 2px 8px rgba(0,0,0,.2);
      animation: fadeIn .2s ease;
    }
    .toast--successo { background: #2e7d32; }
    .toast--errore   { background: #c62828; }
    .toast--info     { background: #1565c0; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
  `]
})
export class ToastComponent implements OnInit {
  notifiche: Notifica[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifiche$.subscribe(n => {
      this.notifiche.push(n);
      setTimeout(() => this.rimuovi(n), 4000);
    });
  }

  rimuovi(n: Notifica) {
    this.notifiche = this.notifiche.filter(x => x !== n);
  }
}