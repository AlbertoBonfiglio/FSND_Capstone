import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthButtonComponent } from './components/auth/auth-button/auth-button.component';
import { Store } from '@ngrx/store';
import { selectUser } from './core/store';
import { CommonModule } from '@angular/common';

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
  user = this.store.select(selectUser)

  constructor(private store: Store) {}
  

  ngOnInit(): void {
    //this.store.dispatch(appLoaded());
  }
}
