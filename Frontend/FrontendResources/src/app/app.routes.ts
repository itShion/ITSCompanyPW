import { Routes } from '@angular/router';
import { Prenotazionitab } from '../prenotazionitab/prenotazionitab';
import { Login } from '../login/login';
import { RegisterComponent } from '../register/register';
import { Prenota } from '../prenota/prenota';
import{RicercaPrenotazione} from '../ricerca-prenotazione/ricerca-prenotazione'
import { MiePrenotazioni } from '../mie-prenotazioni/mie-prenotazioni';

export const routes: Routes = [
   { path: 'mie-prenotazioni', component: MiePrenotazioni },
  { path: 'prenotazionitab', component: Prenotazionitab },
  { path: '', redirectTo: '/prenotazionitab', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'register', component: RegisterComponent},
  {path: 'prenota/:id', component:Prenota},
  {path: 'ricercaPrenotazione', component:RicercaPrenotazione},
  {path: 'miePrenotazioni', component:MiePrenotazioni},
];
