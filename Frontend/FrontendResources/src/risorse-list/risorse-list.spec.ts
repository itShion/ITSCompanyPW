import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisorseList } from './risorse-list';

describe('RisorseList', () => {
  let component: RisorseList;
  let fixture: ComponentFixture<RisorseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RisorseList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisorseList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
