import { Routes } from '@angular/router';
import { RisorseListComponent } from '../risorse-list/risorse-list';

export const routes: Routes = [
    { path: '', redirectTo: '/risorse', pathMatch: 'full' },
    { path: 'risorse', component: RisorseListComponent}
];
