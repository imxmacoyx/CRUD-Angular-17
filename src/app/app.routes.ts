import { Routes } from '@angular/router';
import { TablaComponent } from './components/tabla/tabla.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'tabla',
        pathMatch: 'full'
    },
    {
        path:'tabla',
        component: TablaComponent
    }
];
