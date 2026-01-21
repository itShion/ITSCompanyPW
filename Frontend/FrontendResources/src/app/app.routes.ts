import { Routes } from '@angular/router';
import { Prenotazionitab } from '../prenotazionitab/prenotazionitab';
import { RisorseListComponent } from '../risorse-list/risorse-list';

export const routes: Routes = [
  { path: 'prenotazionitab', component: Prenotazionitab },
  { path: '', redirectTo: '/risorse', pathMatch: 'full' },
  { path: 'risorse', component: RisorseListComponent},
];
