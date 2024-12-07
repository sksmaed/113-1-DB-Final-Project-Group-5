import { TestBed } from '@angular/core/testing';

import { EditExhService } from './edit-exh.service';

describe('EditExhService', () => {
  let service: EditExhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditExhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
