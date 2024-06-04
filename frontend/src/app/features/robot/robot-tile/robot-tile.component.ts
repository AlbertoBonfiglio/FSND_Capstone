import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppRobot } from '../../../core/models/robot.model';
import { CommonModule } from '@angular/common';
import { getRandomIntInclusive } from '../../../core/utils';

@Component({
  selector: 'app-robot-tile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './robot-tile.component.html',
  styleUrl: './robot-tile.component.scss'
})
export class RobotTileComponent {

  @Input() robot?: AppRobot;

  @Output() editClick = new EventEmitter<string>();
  @Output() deleteClick = new EventEmitter<string>();

  getAvatar(): string {
    const num =  getRandomIntInclusive(1,8);  
    console.log('random:', num)
    const avatar: string = this.robot?.preferences.avatar ?? `00${num}-robot.png`; 
    return `/assets/png/${avatar}`;
  }

  onEditClick(event:any) {
    this.editClick.emit(this.robot?.id)
   // event.stopPropagation();
  }

  onDeleteClick(event:any) {
    this.deleteClick.emit(this.robot?.id)
    //event.stopPropagation();
  }
}
