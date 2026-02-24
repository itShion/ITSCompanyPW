import { TestBed } from '@angular/core/testing';
import { StatoPrenotazioneService } from './stato-prenotazione-service';
import { PrenotaService } from './prenota-service';

describe('StatoPrenotazioneService', () => {
  let service: StatoPrenotazioneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PrenotaService]
    });

    service = TestBed.inject(StatoPrenotazioneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});