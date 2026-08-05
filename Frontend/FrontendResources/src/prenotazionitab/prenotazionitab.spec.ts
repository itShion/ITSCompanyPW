import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Prenotazionitab } from './prenotazionitab';

describe('Prenotazionitab', () => {
  let component: Prenotazionitab;
  let fixture: ComponentFixture<Prenotazionitab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prenotazionitab],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prenotazionitab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
