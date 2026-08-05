import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UtenteService } from './utente.service';

describe('UtenteService', () => {
  let service: UtenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UtenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
