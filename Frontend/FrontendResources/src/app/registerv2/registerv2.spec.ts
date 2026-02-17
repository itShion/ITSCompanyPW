import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registerv2 } from './registerv2';

describe('Registerv2', () => {
  let component: Registerv2;
  let fixture: ComponentFixture<Registerv2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registerv2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registerv2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
