import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
   selector: 'app-navbarv2',
  imports: [],
  templateUrl: './navbarv2.html',
  styleUrl: './navbarv2.css',
})
export class navbarv2 implements OnInit{

  private authService = inject(AuthService);
  
  isAuthenticated = false;
  currentUser: any = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
