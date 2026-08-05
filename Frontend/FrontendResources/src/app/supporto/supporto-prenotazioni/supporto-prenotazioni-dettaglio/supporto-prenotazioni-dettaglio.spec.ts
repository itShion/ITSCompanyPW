import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoPrenotazioneDettaglio } from './supporto-prenotazioni-dettaglio';

describe('SupportoPrenotazioneDettaglio', () => {
  let component: SupportoPrenotazioneDettaglio;
  let fixture: ComponentFixture<SupportoPrenotazioneDettaglio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoPrenotazioneDettaglio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoPrenotazioneDettaglio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
