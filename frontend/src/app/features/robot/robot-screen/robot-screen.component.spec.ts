import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotScreenComponent } from './robot-screen.component';

describe('RobotScreenComponent', () => {
  let component: RobotScreenComponent;
  let fixture: ComponentFixture<RobotScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RobotScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
