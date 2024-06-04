import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/core.state';
import { actionSettingsChangeTheme, selectTheme } from '../../core/store';
import { Theme } from '../../core/enums';
import { BehaviorSubject, Subject, distinctUntilChanged, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

const dependencies = [
  CommonModule,
  MatIconModule, 
  MatRippleModule, 
  MatButtonModule
];
type  ThemeIcon = 'dark_mode' | 'light_mode'


@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  imports: [dependencies],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.scss'
})
export class ThemeTogglerComponent {
  private ngUnsubscribe = new Subject<void>();
  private currentTheme = Theme.system;
  icon$: BehaviorSubject<string> = new BehaviorSubject<string>('dark_mode');

  theme$ = this.store.select(selectTheme)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      distinctUntilChanged(),
      tap((value: Theme) => this.icon$.next((value !== Theme.light) ? 'dark_mode' : 'light_mode'))
    )

  constructor(private store: Store<AppState>) { 
    this.icon$.pipe(
      takeUntil(this.ngUnsubscribe),
      distinctUntilChanged(),
      tap((value) => this.currentTheme = (value === 'dark_mode') ? Theme.dark : Theme.light )
    ).subscribe();
    
    //TODO [ ] Implement theme.system
    this.theme$.pipe(
      takeUntil(this.ngUnsubscribe),
      distinctUntilChanged(),
      tap((value) => console.log('[Theme] TODO If system findout if light or dark then set values appropriately'))
    ).subscribe();
  }

  onClick(event:any) {
    const newTheme = (this.currentTheme === Theme.dark) 
      ? Theme.light
      : Theme.dark
    this.store.dispatch(actionSettingsChangeTheme({theme: newTheme}))
  }

  
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
