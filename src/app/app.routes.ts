import { Routes } from '@angular/router';
import { TablaLayoutComponent } from './components/tabla-layout/tabla-layout.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'tabla',
        pathMatch: 'full'
    },
    {
        path:'**',
        redirectTo: 'tabla',
        pathMatch: 'full'
    },
    {
        path:'tabla',
        component: TablaLayoutComponent
    }
];
