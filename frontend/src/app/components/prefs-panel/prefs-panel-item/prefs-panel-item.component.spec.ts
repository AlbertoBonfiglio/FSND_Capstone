import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefsPanelItemComponent } from './prefs-panel-item.component';

describe('PrefsPanelItemComponent', () => {
  let component: PrefsPanelItemComponent;
  let fixture: ComponentFixture<PrefsPanelItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrefsPanelItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrefsPanelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
