import { Component } from '@angular/core';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { cancelEditAppUserData, createAppUserAPIKey, saveAppUserData, selectUser } from '../../../core/store';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { BehaviorSubject, Subject, distinctUntilChanged, takeUntil, tap } from 'rxjs';
import { AppUser } from '../../../core/models/user.model';
import { Language, Status, Theme } from '../../../core/enums';
import { PrefsPanelComponent } from '../../../components/prefs-panel/prefs-panel.component';

const dependencies = [
  CommonModule,
  ReactiveFormsModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule, 
  MatInputModule,
  PrefsPanelComponent,
]

@Component({
  selector: 'app-user-screen',
  standalone: true,
  imports: [dependencies],
  templateUrl: './user-screen.component.html',
  styleUrl: './user-screen.component.scss'
})
export class UserScreenComponent {
  private ngUnsubscribe = new Subject<void>();
  private user$ = this.store.select(selectUser);
  public selectedUser$ : BehaviorSubject<AppUser|null> = new BehaviorSubject<AppUser|null>(null); 
  
  public profileForm = this.fb.group({
    id: ['', []],
    auth_id: [''],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    api_key: ['', []],
    preferences: ['', []],
    /*
    preferences: this.fb.group({
      theme: [Theme.system, [Validators.required]],
      language: [Language.system, [Validators.required]],
    }),
    */
    robots: [-1, []],
    status: [Status.active] 
  });

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder
  ){
    this.user$
    .pipe(
      takeUntil(this.ngUnsubscribe),
      distinctUntilChanged(),
      tap((value) => console.log(value)),
      tap((user) => this.selectedUser$.next(user)),
      tap((user) => this.patchFormGroup(user!)),
    )
    .subscribe();
  }

  private patchFormGroup(user: AppUser) {
    const json = JSON.parse(JSON.stringify(user));
    this.profileForm.patchValue(json);
  }
  
  public canSave(): boolean {
    return this.profileForm.dirty && this.profileForm.valid;     
  }
  onGenerateKey() {
    this.store.dispatch(createAppUserAPIKey(this.selectedUser$.value!.id!));
  }

  onSubmit(form: FormGroup){
    const updated = form.value as AppUser;
    this.store.dispatch(saveAppUserData({data: updated}));
  }

  onCancel(){
    this.store.dispatch(cancelEditAppUserData());
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
