// src/app/forgotpassword/forgotpassword.ts

import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
  encapsulation: ViewEncapsulation.None
})
export class ForgotPassword {
  private http = inject(HttpClient);

  email = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  onSubmit(): void {
    if (this.isLoading) return;

    // Reset messaggi
    this.errorMessage = '';
    this.successMessage = '';

    // Validazione
    if (!this.email) {
      this.errorMessage = 'Inserisci la tua email';
      return;
    }

    // Validazione email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Inserisci un\'email valida';
      return;
    }

    this.isLoading = true;

    // Chiamata al backend
    this.http.post('http://localhost:8000/api/forgot-password/', { email: this.email })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Email inviata! Controlla la tua casella di posta.';
          this.email = ''; // Reset campo
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Errore durante l\'invio. Riprova.';
        }
      });
  }
}