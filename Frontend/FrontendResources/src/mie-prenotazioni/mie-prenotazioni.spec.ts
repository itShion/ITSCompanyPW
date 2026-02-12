import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiePrenotazioni } from './mie-prenotazioni';

describe('MiePrenotazioni', () => {
  let component: MiePrenotazioni;
  let fixture: ComponentFixture<MiePrenotazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiePrenotazioni]
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
