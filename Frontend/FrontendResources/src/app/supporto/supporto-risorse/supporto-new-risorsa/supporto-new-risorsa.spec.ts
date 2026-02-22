import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoNewRisorsa } from './supporto-new-risorsa';

describe('SupportoNewRisorsa', () => {
  let component: SupportoNewRisorsa;
  let fixture: ComponentFixture<SupportoNewRisorsa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoNewRisorsa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoNewRisorsa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
