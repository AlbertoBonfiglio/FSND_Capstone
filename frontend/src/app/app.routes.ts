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
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path:'main',
        loadComponent: () =>
          import('./features/home/home-screen/home-screen.component')
          .then((c) => c.HomeScreenComponent),
        data: { animation: 'fader' },  
        //outlet: 'home-outlet'  
      },
      {
        path:'user/:id/details',
        loadComponent: () =>
          import('./features/user/user-screen/user-screen.component')
          .then((c) => c.UserScreenComponent),
        data: { animation: 'fader' },  
        //outlet: 'home-outlet'  
      },
      {
        path:'robots',
        loadComponent: () =>
          import('./features/robot/robot-list/robot-list.component')
          .then((c) => c.RobotListComponent),
        data: { animation: 'fader' },  
        //outlet: 'home-outlet'  
      },
      
      { 
        path:'robots/details',
        loadComponent: () =>
          import('./features/robot/robot-screen/robot-screen.component')
          .then((c) => c.RobotScreenComponent),
        data: { animation: 'fader' },  
        //outlet: 'home-outlet'  
      },
      {
        path:'robots/:id/details',
        loadComponent: () =>
          import('./features/robot/robot-screen/robot-screen.component')
          .then((c) => c.RobotScreenComponent),
        data: { animation: 'fader' },  
        //outlet: 'home-outlet'  
      },

      {
        path:'robots/:id/charts',
        loadComponent: () =>
          import('./features/robot/robot-chart/robot-chart.component')
          .then((c) => c.RobotChartComponent),
        data: { animation: 'fader' },  
        //outlet: 'home-outlet'  
      },

    ]
  },
  

  //{ path: '**', redirectTo: '/error/404', pathMatch: 'full' },
 
];
