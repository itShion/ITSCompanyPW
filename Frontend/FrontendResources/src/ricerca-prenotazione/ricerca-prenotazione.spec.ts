import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { RicercaPrenotazione } from './ricerca-prenotazione';

describe('RicercaPrenotazione', () => {
  let component: RicercaPrenotazione;
  let fixture: ComponentFixture<RicercaPrenotazione>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaPrenotazione],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
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
