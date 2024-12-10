import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTicketDialogComponent } from './buy-ticket-dialog.component';

describe('BuyTicketDialogComponent', () => {
  let component: BuyTicketDialogComponent;
  let fixture: ComponentFixture<BuyTicketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyTicketDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
