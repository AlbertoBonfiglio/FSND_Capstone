import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthButtonComponent } from './components/auth/auth-button/auth-button.component';
import { Store } from '@ngrx/store';
import { refreshDataset, selectAuthUser, selectUser } from './core/store';
import { CommonModule } from '@angular/common';
import { AppState } from '@auth0/auth0-angular';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AuthButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  user$ = this.store.select(selectAuthUser)
  .pipe(
    tap((v)=> console.log("user has changed", v)),
  );

  constructor(private store: Store<AppState>) {
    console.log(store) ;
  }
  

  ngOnInit(): void {
    //this.store.dispatch(appLoaded());
  }

  refresh() {
    this.store.dispatch(refreshDataset());
  }
}
