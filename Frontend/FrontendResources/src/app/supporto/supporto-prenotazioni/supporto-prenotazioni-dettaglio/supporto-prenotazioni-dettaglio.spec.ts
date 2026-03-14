import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoPrenotazioniDettaglio } from './supporto-prenotazioni-dettaglio';

describe('SupportoPrenotazioniDettaglio', () => {
  let component: SupportoPrenotazioniDettaglio;
  let fixture: ComponentFixture<SupportoPrenotazioniDettaglio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoPrenotazioniDettaglio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoPrenotazioniDettaglio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
