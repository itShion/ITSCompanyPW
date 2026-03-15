import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterModule, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { navbarv2 } from './navbarv2/navbarv2';
import { filter } from 'rxjs';
import { ToastComponent } from './toast/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, RouterModule, navbarv2, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private hiddenNavbarRoutes = [
    '/loginv2',
    '/register',
    '/registerv2'
  ];

  showNavbar = true;
  isAuthenticated = false;
  currentUser: any = null;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = !this.hiddenNavbarRoutes.includes(
          event.urlAfterRedirects
        );
      });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.cdr.detectChanges();
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
