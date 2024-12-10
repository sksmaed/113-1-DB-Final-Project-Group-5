import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisTranComponent } from './analysis-tran.component';

describe('AnalysisTranComponent', () => {
  let component: AnalysisTranComponent;
  let fixture: ComponentFixture<AnalysisTranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisTranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisTranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
