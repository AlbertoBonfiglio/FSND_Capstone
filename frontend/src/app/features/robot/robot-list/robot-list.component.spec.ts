import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotListComponent } from './robot-list.component';

describe('RobotListComponent', () => {
  let component: RobotListComponent;
  let fixture: ComponentFixture<RobotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RobotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
