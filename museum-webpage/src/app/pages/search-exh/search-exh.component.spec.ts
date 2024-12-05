import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchExhComponent } from './search-exh.component';

describe('SearchExhComponent', () => {
  let component: SearchExhComponent;
  let fixture: ComponentFixture<SearchExhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchExhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchExhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
