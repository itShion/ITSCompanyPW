import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoPrenotazioni } from './supporto-prenotazioni';

describe('SupportoPrenotazioni', () => {
  let component: SupportoPrenotazioni;
  let fixture: ComponentFixture<SupportoPrenotazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoPrenotazioni]
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
