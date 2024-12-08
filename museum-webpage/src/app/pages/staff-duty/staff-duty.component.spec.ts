import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDutyComponent } from './staff-duty.component';

describe('StaffDutyComponent', () => {
  let component: StaffDutyComponent;
  let fixture: ComponentFixture<StaffDutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDutyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
