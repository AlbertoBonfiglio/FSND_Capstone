import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { editAppUserData, selectUser } from '../../../core/store';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map, tap } from 'rxjs';
import { User as Auth0User } from "@auth0/auth0-spa-js";
import { AppUser } from '../../../core/models/user.model';

const dependencies = [
  CommonModule,
  RouterModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
];


@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [dependencies],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  appUser$ = this.store.select(selectUser);
  authUser$ = this.store.select(selectUser);
 
  public userData$: Observable<{
    appUser: AppUser|null,
    authUser: Auth0User|null
  }>;
  constructor(
    private store: Store<AppState>,
  ) {

    this.userData$ = combineLatest([this.appUser$, this.authUser$])
      .pipe(
        map(([appUser, authUser]) => {
          return {
              appUser, 
              authUser
            }
        }),
        tap((v) => console.log(v))
    );
  }

  navigateToUser(user:AppUser) {
    this.store.dispatch(editAppUserData({data: user}));
  }
}
