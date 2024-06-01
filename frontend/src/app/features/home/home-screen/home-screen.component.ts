import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RobotListComponent } from '../../robot/robot-list/robot-list.component';
import { UserCardComponent } from '../../user/user-card/user-card.component';

const dependencies = [
  CommonModule,
];

const components = [
  UserCardComponent,
  RobotListComponent
];

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
    dependencies,
    components
  ],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeScreenComponent {
  constructor() {}

  ngOnInit() {
  } 

}
