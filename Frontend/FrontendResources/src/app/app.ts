import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { Navbarv2 } from "./navbarv2/navbarv2";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, RouterModule, Navbarv2, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  showNavbar = true;
  private hiddenNavbarRoutes = [
    '/loginv2',
    '/register',
    '/registerv2'
  ];

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
  }

}
