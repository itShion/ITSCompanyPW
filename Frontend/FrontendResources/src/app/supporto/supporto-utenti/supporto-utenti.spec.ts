import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { SupportoUtenti } from './supporto-utenti';

describe('SupportoUtenti', () => {
  let component: SupportoUtenti;
  let fixture: ComponentFixture<SupportoUtenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoUtenti],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoUtenti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
