import { TestBed } from '@angular/core/testing';

import { SearchExhService } from './search-exh.service';

describe('SearchExhService', () => {
  let service: SearchExhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchExhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
