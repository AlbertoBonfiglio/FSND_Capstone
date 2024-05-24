import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { allAuthActions, selectAuthUser, selectIsAdmin } from '../../../core/store';
import { environment as env} from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map, tap } from 'rxjs';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss'
})
export class HomeNavbarComponent {
  title:string = env.appTitle
  user$ = this.store.select(selectAuthUser);
  isAdmin$ = this.store.select(selectIsAdmin);
  
  public data$: Observable<{
    user: any,
    isAdmin: boolean
  }>;

  

  constructor(private store: Store<AppState>) {
    this.data$ = combineLatest([this.user$, this.isAdmin$])
      .pipe(
        map(([user, isAdmin]) => {
          return {
                user, 
                isAdmin
            }
        }),
        tap((v) => console.log(v))
    );
  }
  
 
   public logIn() {
    this.store.dispatch(allAuthActions.loginFlowInitiated())
  }
  public logOut() {
    this.store.dispatch(allAuthActions.logoutFlowInitiated())
  }

  public notImplementedYet(){}
}
