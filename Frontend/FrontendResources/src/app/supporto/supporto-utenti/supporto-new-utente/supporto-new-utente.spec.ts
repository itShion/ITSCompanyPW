import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoNewUtente } from './supporto-new-utente';

describe('SupportoNewUtente', () => {
  let component: SupportoNewUtente;
  let fixture: ComponentFixture<SupportoNewUtente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoNewUtente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoNewUtente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
