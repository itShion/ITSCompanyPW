import { Routes } from '@angular/router';
import { Prenotazionitab } from '../prenotazionitab/prenotazionitab';
import { Login } from '../login/login';
import { RegisterComponent } from '../register/register';
import { Prenota } from '../prenota/prenota';

export const routes: Routes = [
  { path: 'prenotazionitab', component: Prenotazionitab },
  { path: '', redirectTo: '/prenotazionitab', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'register', component: RegisterComponent},
  {path: 'prenota/:id', component:Prenota},
];
