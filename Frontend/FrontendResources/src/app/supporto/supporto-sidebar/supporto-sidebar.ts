import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-supporto-sidebar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './supporto-sidebar.html',
  styleUrl: './supporto-sidebar.css',
})
export class SupportoSidebar {

}
