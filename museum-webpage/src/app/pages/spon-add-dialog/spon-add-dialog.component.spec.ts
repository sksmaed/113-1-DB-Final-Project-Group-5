import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponAddDialogComponent } from './spon-add-dialog.component';

describe('SponAddDialogComponent', () => {
  let component: SponAddDialogComponent;
  let fixture: ComponentFixture<SponAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
