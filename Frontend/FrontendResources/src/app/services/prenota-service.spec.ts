import { TestBed } from '@angular/core/testing';

import { PrenotaService } from './prenota-service';

describe('PrenotaService', () => {
  let service: PrenotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrenotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
