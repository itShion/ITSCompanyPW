import { Routes } from '@angular/router';
import { Prenotazionitab } from '../prenotazionitab/prenotazionitab';
import { RisorseListComponent } from '../risorse-list/risorse-list';
import { Login } from '../login/login';
import { RegisterComponent } from '../register/register';
import { Prenota } from '../prenota/prenota';

export const routes: Routes = [
  { path: 'prenotazionitab', component: Prenotazionitab },
  { path: '', redirectTo: '/risorse', pathMatch: 'full' },
  { path: 'risorse', component: RisorseListComponent},
  { path: 'login', component: Login},
  { path: 'register', component: RegisterComponent},
  {path: 'prenota/:id', component:Prenota},
];
