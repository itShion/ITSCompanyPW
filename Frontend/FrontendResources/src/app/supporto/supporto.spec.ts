import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Supporto } from './supporto';

describe('Supporto', () => {
  let component: Supporto;
  let fixture: ComponentFixture<Supporto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Supporto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Supporto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
