import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolAddDialogComponent } from './vol-add-dialog.component';

describe('VolAddDialogComponent', () => {
  let component: VolAddDialogComponent;
  let fixture: ComponentFixture<VolAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
