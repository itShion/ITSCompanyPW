import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificaService } from '../services/notifica-service';
import { Notifica, NotificaResponse } from '../../models/Notifica';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-navbarv2',
   standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbarv2.html',
  styleUrl: './navbarv2.css',
})
export class Navbarv2 implements OnInit{

  private authService = inject(AuthService);
  
  isAuthenticated = false;
  currentUser: any = null;
  unreadCount = signal(0);
  notifiche = signal<any[]>([]);
  popupAperto = signal(false);

    constructor(private notificaService: NotificaService) {}

  ngOnInit(): void {
     this.loadNotifiche();
     setInterval(() => this.loadNotifiche(), 30000); // refresh ogni 30s
    
      this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

loadNotifiche() {
  this.notificaService.getUnread().subscribe(res => {
    this.unreadCount.set(res.count);
    this.notifiche.set(res.results);
  });
}

togglePopup() {
    this.popupAperto.update(v => !v);
  }

  segnaComeLetta(notifica: Notifica) {
    this.notificaService.markRead(notifica.id).subscribe(() => {
      // aggiorna badge e lista
      this.loadNotifiche();
    });
  }

}
