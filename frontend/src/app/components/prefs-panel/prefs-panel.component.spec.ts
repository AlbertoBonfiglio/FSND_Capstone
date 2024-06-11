import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefsPanelComponent } from './prefs-panel.component';

describe('PrefsPanelComponent', () => {
  let component: PrefsPanelComponent;
  let fixture: ComponentFixture<PrefsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrefsPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrefsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
