import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterDTO } from '../../models/Utente';

@Component({
  selector: 'app-registerv2',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registerv2.html',
  styleUrl: './registerv2.css',
  encapsulation: ViewEncapsulation.None
})
export class registerv2 {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  userData: RegisterDTO = {
    username: '',
    email: '',
    password: '',
    telefono: '',
    first_name: '',
    last_name: '',
    repeatPassword: '',
  };
  
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.authService.register(this.userData).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Errore nella registrazione';
      }
    });
  }
}