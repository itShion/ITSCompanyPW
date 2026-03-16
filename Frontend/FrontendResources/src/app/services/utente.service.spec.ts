import { TestBed } from '@angular/core/testing';

import { UtenteSevice } from './utente.sevice';

describe('UtenteService', () => {
  let service: UtenteSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtenteSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
