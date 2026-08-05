import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { SupportoRisorse } from './supporto-risorse';

describe('SupportoRisorse', () => {
  let component: SupportoRisorse;
  let fixture: ComponentFixture<SupportoRisorse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoRisorse],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoRisorse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
