import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { MiePrenotazioni } from './mie-prenotazioni';

describe('MiePrenotazioni', () => {
  let component: MiePrenotazioni;
  let fixture: ComponentFixture<MiePrenotazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiePrenotazioni],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiePrenotazioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
