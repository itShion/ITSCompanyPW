import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loginv2 } from './loginv2';

describe('Loginv2', () => {
  let component: Loginv2;
  let fixture: ComponentFixture<Loginv2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loginv2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loginv2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
