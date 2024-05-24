import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { allAuthActions } from '../../../core/store';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports:  [MatButton, MatTooltip],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss'
})
export class AuthButtonComponent {
  // Inject the authentication service into your component through the constructor
  constructor(private store: Store) {}

  loginWithRedirect(): void {
    console.log("loginWithRedirect", this.store);
    this.store.dispatch(allAuthActions.loginFlowInitiated())
  }
}
