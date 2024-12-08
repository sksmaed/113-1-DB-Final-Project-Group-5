import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDutyAddDialogComponent } from './staff-duty-add-dialog.component';

describe('StaffDutyAddDialogComponent', () => {
  let component: StaffDutyAddDialogComponent;
  let fixture: ComponentFixture<StaffDutyAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDutyAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDutyAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
