import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { SupportoPrenotazioni } from './supporto-prenotazioni';

describe('SupportoPrenotazioni', () => {
  let component: SupportoPrenotazioni;
  let fixture: ComponentFixture<SupportoPrenotazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoPrenotazioni],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoPrenotazioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
