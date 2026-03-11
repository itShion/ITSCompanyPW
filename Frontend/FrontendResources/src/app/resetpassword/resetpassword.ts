// src/app/resetpassword/resetpassword.ts

import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css',
  encapsulation: ViewEncapsulation.None
})
export class ResetPassword implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  uid = '';
  token = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  invalidLink = false;

  ngOnInit(): void {
    // Prendi uid e token dall'URL
    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'] || '';
      this.token = params['token'] || '';

      // Se mancano uid o token, link non valido
      if (!this.uid || !this.token) {
        this.invalidLink = true;
        this.errorMessage = 'Link non valido o scaduto';
      }
    });
  }

  onSubmit(): void {
    if (this.isLoading || this.invalidLink) return;

    // Reset messaggi
    this.errorMessage = '';
    this.successMessage = '';

    // Validazioni
    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Compila tutti i campi';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Le password non coincidono';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La password deve essere di almeno 6 caratteri';
      return;
    }

    this.isLoading = true;

    // Chiamata al backend
    this.http.post('http://localhost:8000/api/reset-password/', {
      uid: this.uid,
      token: this.token,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Password aggiornata con successo!';
        
        // Redirect al login dopo 3 secondi
        setTimeout(() => {
          this.router.navigate(['/loginv2']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Errore durante il reset. Riprova.';
      }
    });
  }
}