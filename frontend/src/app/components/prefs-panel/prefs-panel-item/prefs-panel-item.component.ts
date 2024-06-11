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
  edit,
  delete,
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
  @Input() value: Preference|null = null;

  onClickEvent = output<{}>()

  onEdit() {
    this.onClickEvent.emit({
      type: Operation.edit,
      item: this.value});
  } 
}
