import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prenotazionitab } from './prenotazionitab';

describe('Prenotazionitab', () => {
  let component: Prenotazionitab;
  let fixture: ComponentFixture<Prenotazionitab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prenotazionitab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prenotazionitab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
