import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prenota } from './prenota';

describe('Prenota', () => {
  let component: Prenota;
  let fixture: ComponentFixture<Prenota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prenota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prenota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
