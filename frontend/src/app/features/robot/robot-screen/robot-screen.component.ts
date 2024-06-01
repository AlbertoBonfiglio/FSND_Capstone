import { Component, Input } from '@angular/core';
import { AppState } from '../../../core/store/core.state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectedRobot } from '../../../core/store';
import { AppRobot } from '../../../core/models/robot.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const dependencies = [
  CommonModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  FormsModule, 
  MatFormFieldModule, 
  MatInputModule
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
  @Input()
  set id(robotId: string) {
    console.log(`Robot id: ${robotId}`); 
    (robotId) ? this.isEdit$.next(true): this.isEdit$.next(false);
  }

  isEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  robot$ = this.store.select(selectedRobot)
    .pipe(
      tap((robot) => console.log('Found:', robot))
    );

  public robotData$: Observable<{
    robot: AppRobot|null,
    isEdit: boolean
  }>;

  constructor(private store: Store<AppState>) {
     this.robotData$ = combineLatest([this.robot$, this.isEdit$])
      .pipe(
        map(([robot, isEdit]) => {
          return {
              robot, 
              isEdit
            }
        }),
        tap((v) => console.log(v))
    );
  }

  ngOnInit  () {

  }

  ngOnDestroy() {}
}
