import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { LoginDTO } from '../models/Utente';

@Component({
  selector: 'app-loginv2',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './loginv2.html',
  styleUrl: './loginv2.css',
  encapsulation: ViewEncapsulation.None
})
export class Loginv2 {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginDTO = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['']),
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Credenziali non valide';
      }
    });
  }
}
