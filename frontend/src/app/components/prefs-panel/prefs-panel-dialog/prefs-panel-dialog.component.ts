import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Preference } from '../../../core/models/preferences.model';

export enum ValueType {
  boolean = 'boolean',
  string = 'string',
  number = 'number' 
}

const dependencies = [
  CommonModule,
  FormsModule, 
  ReactiveFormsModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule, 
  MatInputModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
];

@Component({
  selector: 'app-prefs-panel-dialog',
  standalone: true,
  imports: [dependencies],
  templateUrl: './prefs-panel-dialog.component.html',
  styleUrl: './prefs-panel-dialog.component.scss'
})


export class PrefsPanelDialogComponent {
  @Input() 
  valueType: ValueType = ValueType.string;

  constructor(
    public dialogRef: MatDialogRef<PrefsPanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Preference,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
