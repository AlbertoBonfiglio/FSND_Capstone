import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthButtonComponent } from '../../components/auth/auth-button/auth-button.component';
import { HomeNavbarComponent } from './home-navbar/home-navbar.component';

const modules = [CommonModule,];
const components = [
  HomeNavbarComponent,
  AuthButtonComponent,
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

}
