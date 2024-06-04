import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { AppState } from '@auth0/auth0-angular';
import { environment as env} from '../environments/environment';
import { selectTheme } from './core/store';
import { distinctUntilChanged, tap } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
  ],
  template: `
    <div [class]="(theme$ | async)">
      <router-outlet></router-outlet>
    </div>`,
  styleUrl: './app.component.scss',
})

export class AppComponent {
  title = env.appTitle;

  theme$ = this.store.select(selectTheme)
  .pipe(
    distinctUntilChanged(),
    tap((value) => console.log('theme:', value)),
  );

  constructor(private store: Store<AppState>) {}
  
  ngOnInit(): void {
    //this.store.dispatch(appLoaded());
  }


}
