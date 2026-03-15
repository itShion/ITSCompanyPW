import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prenotazioni } from './prenotazioni';

describe('Prenotazioni', () => {
  let component: Prenotazioni;
  let fixture: ComponentFixture<Prenotazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prenotazioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prenotazioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
