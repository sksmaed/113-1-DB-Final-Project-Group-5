import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransHistoryComponent } from './customer-trans-history.component';

describe('CustomerTransHistoryComponent', () => {
  let component: CustomerTransHistoryComponent;
  let fixture: ComponentFixture<CustomerTransHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTransHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTransHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
