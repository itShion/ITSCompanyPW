// src/app/navbar/navbar.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../../models/Utente';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  
  currentUser: CurrentUser | null = null;

  ngOnInit(): void {
    // Ottieni l'utente corrente quando il componente si carica
    this.currentUser = this.authService.getCurrentUser();
    
    // Ascolta i cambiamenti dell'utente
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}