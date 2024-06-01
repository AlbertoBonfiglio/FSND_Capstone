import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthButtonComponent } from '../../components/auth/auth-button/auth-button.component';
import { HomeNavbarComponent } from './home-navbar/home-navbar.component';
import { IFabButton, SpeedDialComponent, fabType } from '../../components';
import { RouterOutlet } from '@angular/router';

const modules = [
  CommonModule
];

const components = [
  RouterOutlet,
  HomeNavbarComponent,
  AuthButtonComponent,
  SpeedDialComponent
];

const FabButtons: IFabButton[] = [
  { icon: 'home', action: 'home', type: fabType.rlink },
  { icon: 'user', action: 'home/user', type: fabType.rlink },
  { icon: 'settings', action: 'home/settings', type: fabType.rlink },
  { icon: 'arrow_upward', action: '', type: fabType.scrollUp },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    modules,
    components  
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  fabButtons: IFabButton[] = FabButtons; 

}
