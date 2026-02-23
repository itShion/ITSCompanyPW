import { Routes } from '@angular/router';
import { Prenotazionitab } from '../prenotazionitab/prenotazionitab';
import { Login } from '../login/login';
import { RegisterComponent } from '../register/register';
import { Prenota } from '../prenota/prenota';
import { registerv2 } from './registerv2/registerv2';
import { Loginv2 } from '../loginv2/loginv2';
import { navbarv2 } from './navbarv2/navbarv2';

export const routes: Routes = [
  { path: 'prenotazionitab', component: Prenotazionitab },
  { path: '', redirectTo: '/prenotazionitab', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'register', component: RegisterComponent},
  {path: 'prenota/:id', component: Prenota},
  {path: 'registerv2', component: registerv2},
  {path: 'prenota/:id', component:Prenota},
  {path: 'loginv2', component:Loginv2},
  {path: 'navbarv2', component: navbarv2}
];
