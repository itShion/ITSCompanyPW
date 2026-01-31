import { TestBed } from '@angular/core/testing';

import { Risorsa } from './risorsa';

describe('Risorsa', () => {
  let service: Risorsa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Risorsa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
