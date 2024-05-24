import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component')
      .then((m) => m.HomeComponent),
    data: { animation: 'fader' },
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/error/404', pathMatch: 'full' },
 
];
