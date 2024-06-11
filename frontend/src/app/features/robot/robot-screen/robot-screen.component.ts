import { Component, Input } from '@angular/core';
import { AppState } from '../../../core/store/core.state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, combineLatest, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { cancelEditRobot, saveUserRobot, selectAppUserId, selectedRobot } from '../../../core/store';
import { AppRobot } from '../../../core/models/robot.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Status } from '../../../core/enums';
import { PrefsPanelComponent } from '../../../components/prefs-panel/prefs-panel.component';

class combinedObs {
    id: string|undefined;
    robot: AppRobot|null = null;
    isEdit: boolean = false
  }

const dependencies = [
  CommonModule,
  ReactiveFormsModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  FormsModule, 
  MatFormFieldModule, 
  MatInputModule,
  PrefsPanelComponent
];

@Component({
  selector: 'app-robot-screen',
  standalone: true,
  imports: [
    dependencies,
  ],
  templateUrl: './robot-screen.component.html',
  styleUrl: './robot-screen.component.scss'
})
export class RobotScreenComponent {
  private ngUnsubscribe = new Subject<void>();
  
  @Input()
  set id(robotId: string) {
    console.log("Set: ", robotId);
    (robotId) ? this.isEdit$.next(true): this.isEdit$.next(false);
  }

  private isEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userId$ = this.store.select(selectAppUserId);
  private robot$ = this.store.select(selectedRobot);

  public robotData$: BehaviorSubject<combinedObs> = new BehaviorSubject(new combinedObs);


  public robotForm = this.fb.group({
    id: ['', []],
    name: ['', [Validators.required, Validators.minLength(8)]],
    mac: ['', [Validators.required, Validators.minLength(17)]],
    description: ['', []],
    preferences
    : this.fb.group({
    }),
    status: [Status.active] 
  });

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) {

    combineLatest([this.userId$,this.robot$, this.isEdit$])
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(([id, robot, isEdit]) => {
          console.log(id, robot, isEdit); 
          (robot) 
            ? this.patchFormGroup(robot) 
            : this.robotForm.patchValue(
              JSON.parse(JSON.stringify(new AppRobot()))
            )

          return of({id,robot, isEdit})
        })
      )
      .subscribe((value) => this.robotData$.next(value));
  }

  ngOnInit  () {

  }

  private patchFormGroup(robot: AppRobot) {
    const json = JSON.parse(JSON.stringify(robot));
    console.log(json);
    this.robotForm.patchValue(json);
  }

  public canSave(): boolean {
    return this.robotForm.dirty && this.robotForm.valid;     
  }

  onSubmit(form: FormGroup){
    const updated = form.value as AppRobot;
    if (!updated.id) {
      updated.id = this.robotData$.value.id
    } 
    this.store.dispatch(saveUserRobot({robot: updated}));
  }

  onCancel(){
    this.store.dispatch(cancelEditRobot());
  }


  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
