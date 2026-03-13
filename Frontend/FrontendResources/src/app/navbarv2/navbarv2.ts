import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule, Router } from '@angular/router';
import { CommonModule, UpperCasePipe, AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-navbarv2',
  standalone: true,
  imports: [RouterLink, UpperCasePipe, AsyncPipe, CommonModule],
  templateUrl: './navbarv2.html',
  styleUrl: './navbarv2.css',
})
export class navbarv2 implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: any = null;

  //Mostra la sezione supporto solo agli admin e ai responsabili
  showSupport$ = this.authService.currentUser$.pipe(
    map(user => {
    const ruolo = user?.ruolo?.toLowerCase();
    return ruolo === 'admin' || ruolo === 'responsabile';
  })
  );

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      //console.log('Utente aggiornato: ', user);
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();

  }

}
