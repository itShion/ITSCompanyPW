import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { registerv2 } from './registerv2';

describe('registerv2', () => {
  let component: registerv2;
  let fixture: ComponentFixture<registerv2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [registerv2],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(registerv2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
