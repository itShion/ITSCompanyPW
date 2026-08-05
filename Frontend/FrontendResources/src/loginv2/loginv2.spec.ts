import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Loginv2 } from './loginv2';

describe('Loginv2', () => {
  let component: Loginv2;
  let fixture: ComponentFixture<Loginv2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loginv2],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loginv2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
