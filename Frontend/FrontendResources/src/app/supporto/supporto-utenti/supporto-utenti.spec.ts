import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoUtenti } from './supporto-utenti';

describe('SupportoUtenti', () => {
  let component: SupportoUtenti;
  let fixture: ComponentFixture<SupportoUtenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoUtenti]
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
