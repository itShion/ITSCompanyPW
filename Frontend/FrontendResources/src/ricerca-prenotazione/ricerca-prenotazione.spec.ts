import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaPrenotazione } from './ricerca-prenotazione';

describe('RicercaPrenotazione', () => {
  let component: RicercaPrenotazione;
  let fixture: ComponentFixture<RicercaPrenotazione>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaPrenotazione]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RicercaPrenotazione);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
