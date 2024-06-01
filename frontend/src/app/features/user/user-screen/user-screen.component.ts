import { Component } from '@angular/core';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../core/store';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

const dependencies = [
  CommonModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  FormsModule, 
  MatFormFieldModule, 
  MatInputModule
]

@Component({
  selector: 'app-user-screen',
  standalone: true,
  imports: [dependencies],
  templateUrl: './user-screen.component.html',
  styleUrl: './user-screen.component.scss'
})
export class UserScreenComponent {
  user$ = this.store.select(selectAuthUser);

  constructor(private store: Store<AppState>){

  }
}
