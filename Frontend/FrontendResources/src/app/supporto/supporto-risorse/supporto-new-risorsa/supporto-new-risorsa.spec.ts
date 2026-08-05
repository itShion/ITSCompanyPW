import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoNewRisorsaComponent } from './supporto-new-risorsa';

describe('SupportoNewRisorsaComponent', () => {
  let component: SupportoNewRisorsaComponent;
  let fixture: ComponentFixture<SupportoNewRisorsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoNewRisorsaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoNewRisorsaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
