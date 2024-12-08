import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExhibitionComponent } from './add-exhibition.component';

describe('AddExhibitionComponent', () => {
  let component: AddExhibitionComponent;
  let fixture: ComponentFixture<AddExhibitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExhibitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExhibitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
