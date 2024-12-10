import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTranComponent } from './view-tran.component';

describe('ViewTranComponent', () => {
  let component: ViewTranComponent;
  let fixture: ComponentFixture<ViewTranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
