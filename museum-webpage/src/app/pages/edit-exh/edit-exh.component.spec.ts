import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExhComponent } from './edit-exh.component';

describe('EditExhComponent', () => {
  let component: EditExhComponent;
  let fixture: ComponentFixture<EditExhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
