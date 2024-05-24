import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { AppState } from '@auth0/auth0-angular';
import { environment as env} from '../environments/environment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
  ],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  title = env.appTitle;

  constructor(private store: Store<AppState>) {}
  
  ngOnInit(): void {
    //this.store.dispatch(appLoaded());
  }


}
