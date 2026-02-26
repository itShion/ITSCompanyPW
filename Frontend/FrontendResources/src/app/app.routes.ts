import { Routes } from '@angular/router';
import { Prenotazionitab } from '../prenotazionitab/prenotazionitab';
import { Login } from '../login/login';
import { RegisterComponent } from '../register/register';
import { Prenota } from '../prenota/prenota';
import { RicercaPrenotazione } from '../ricerca-prenotazione/ricerca-prenotazione'
import { MiePrenotazioni } from '../mie-prenotazioni/mie-prenotazioni';
import { registerv2 } from './registerv2/registerv2';
import { Loginv2 } from '../loginv2/loginv2';
import { Supporto } from './supporto/supporto';
import { Forgotpassword } from './forgotpassword/forgotpassword';
import { SupportoRisorse } from './supporto/supporto-risorse/supporto-risorse';
import { SupportoUtenti } from './supporto/supporto-utenti/supporto-utenti';
import { SupportoSidebar } from './supporto/supporto-sidebar/supporto-sidebar';
import { SupportoPrenotazioni } from './supporto/supporto-prenotazioni/supporto-prenotazioni';

export const routes: Routes = [
  { path: 'mie-prenotazioni', component: MiePrenotazioni },
  { path: 'prenotazionitab', component: Prenotazionitab },
  { path: '', redirectTo: '/ricercaPrenotazione', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'prenota/:id', component: Prenota },
  { path: 'registerv2', component: registerv2 },
  { path: 'loginv2', component: Loginv2 },
  { path: 'forgotpassword', component: Forgotpassword },
  { path: 'ricercaPrenotazione', component: RicercaPrenotazione },
  { path: 'miePrenotazioni', component: MiePrenotazioni },
  {
    path: 'supporto',
    component: SupportoSidebar,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Supporto },
      { path: 'utenti', component: SupportoUtenti },
      { path: 'risorse', component: SupportoRisorse },
      { path: 'prenotazioni', component: SupportoPrenotazioni }
    ]
  }
];
