import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/core.state';
import { addUserRobot, deleteUserRobot, editUserRobot, selectAppUserRobots, setSelectedRobot } from '../../../core/store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Observable, distinctUntilChanged, tap } from 'rxjs';
import { AppRobot } from '../../../core/models/robot.model';
import { RobotTileComponent } from '../robot-tile/robot-tile.component';

const dependencies = [
  CommonModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  RobotTileComponent
];


@Component({
  selector: 'app-robot-list',
  standalone: true,
  imports: [dependencies],
  templateUrl: './robot-list.component.html',
  styleUrl: './robot-list.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class RobotListComponent {

  selected: string = '';

  robots$: Observable<any> = this.store.select(selectAppUserRobots)
  .pipe(
    distinctUntilChanged(),
    tap((bots) => console.log("Implement a mechanism to dispatch an action if not an array", bots )),
    // todo [] check if there is a selected item already and that it hasn't been removed from 
    // the array before setting a new one
    tap((bots) => (bots && bots.length > 0) 
      ? this.selected = bots[0].id!
      : this.selected = ''
    )
  );

  
  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
  }
 
   isSelected(robot:AppRobot) {
    return robot.id === this.selected;
  }

  selectRobot(robot:AppRobot) {
    this.store.dispatch(setSelectedRobot({data: robot}));
  }

  public onAddRobot() {
    this.store.dispatch(addUserRobot())
  }
  
  public onEditRobot(event:any) {
    console.log(event)
    this.store.dispatch(editUserRobot({robotId: event}));
  }


  public onDeleteRobot(event: any) {
    this.store.dispatch(deleteUserRobot({robotId: event}))
  }

}
