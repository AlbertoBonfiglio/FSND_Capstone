import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotTileComponent } from './robot-tile.component';

describe('RobotTileComponent', () => {
  let component: RobotTileComponent;
  let fixture: ComponentFixture<RobotTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RobotTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
