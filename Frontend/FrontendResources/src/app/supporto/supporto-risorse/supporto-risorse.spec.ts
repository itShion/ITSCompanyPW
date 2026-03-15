import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoRisorse } from './supporto-risorse';

describe('SupportoRisorse', () => {
  let component: SupportoRisorse;
  let fixture: ComponentFixture<SupportoRisorse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoRisorse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoRisorse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
