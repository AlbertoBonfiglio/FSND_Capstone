import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Preference } from '../../../core/models/preferences.model';
import { MatListModule } from '@angular/material/list';

const dependencies = [
  CommonModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,  
  MatListModule
];

export enum Operation {
  add,
  edit,
  delete,
}

export type PrefAction = {
  pref: Preference|undefined;
  ops: Operation  
}

@Component({
  selector: 'app-prefs-panel-item',
  standalone: true,
  imports: [dependencies],
  templateUrl: './prefs-panel-item.component.html',
  styleUrl: './prefs-panel-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class PrefsPanelItemComponent {
  @Input() value: Preference|undefined = undefined;

  onClickEvent = output<{}>()

  onEdit() {
    let action: PrefAction = {
      pref: this.value,
      ops: Operation.edit
    }
    this.onClickEvent.emit(action);  
  } 

  onDelete() {
    let action: PrefAction = {
      pref: this.value,
      ops: Operation.delete
    }
    this.onClickEvent.emit(action);
  } 
}
