import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Preference } from '../../core/models/preferences.model';
import { PrefsPanelDialogComponent} from './prefs-panel-dialog/prefs-panel-dialog.component';
import { PrefsPanelItemComponent, Operation, PrefAction} from './prefs-panel-item/prefs-panel-item.component';

const dependencies = [
  CommonModule,
  FormsModule, 
  ReactiveFormsModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule, 
  MatInputModule,
  MatListModule,
  PrefsPanelItemComponent,
  PrefsPanelDialogComponent
];

@Component({
  selector: 'app-prefs-panel',
  standalone: true,
  imports: [dependencies],
  templateUrl: './prefs-panel.component.html',
  styleUrl: './prefs-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrefsPanelComponent),
      multi: true,
    },
    /*
     {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: PrefsPanelComponent
    }
    */
  ]
})
export class PrefsPanelComponent implements ControlValueAccessor {
  
  protected onTouched = () => {};

  protected onChange = (prefs: Preference[]) => {};
  
  touched = false;

  disabled = false;

  private values$: BehaviorSubject<Preference[]> = 
    new BehaviorSubject<Preference[]>([]);
  public get preferences$() { return this.values$;}


  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
  }

  writeValue(prefs: Preference[] = []): void {
    console.log('writeValue', prefs)
    this.values$.next(prefs);
    this.cdr.markForCheck();
  }

  protected setValue(value: Preference[], emitEvent: boolean = true) {
    if(emitEvent && !this.disabled){
      this.markAsTouched();
      this.onChange(value);
      this.values$.next(value);
    }
  }

  onUpsert(item: Preference) {
    let items = this.values$.value;
    const idx = items
      .findIndex((i) => i.key.toLowerCase() === item.key.toLowerCase());
    console.log("index", idx, item);
    (idx === -1) 
      ? items.push(item)
      : items[idx] = item;
    
    this.setValue(items, true);
  }

  onRemove(key: string) {
    let items = this.values$.value;
    // checks for readonly
    const item = items.find((item) => (item.key === key) && (item.required === false));
    // filters the array
    if (item) {
      const values = items.filter((item) => item.key !== key);
      this.setValue(values, true);
    }    
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;

  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onItemClick($event: any){
    console.log($event); 
    ($event?.ops === Operation.delete) 
      ? this.deletePreference($event.pref!)
      : this.showDialog($event?.pref);
  }


  private showDialog(preference: Preference|undefined): void {
    let data = preference ?? new Preference("", "");
    const dialogRef = this.dialog.open(PrefsPanelDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) this.onUpsert(result);
    });
  }
  
  deletePreference(preference: Preference): void {
    this.onRemove(preference.key)   
  }
  
}
