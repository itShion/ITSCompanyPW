import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbarv2 } from './navbarv2';

describe('Navbarv2', () => {
  let component: Navbarv2;
  let fixture: ComponentFixture<Navbarv2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbarv2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbarv2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
