import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportoActivitylog } from './supporto-activitylog';

describe('SupportoActivitylog', () => {
  let component: SupportoActivitylog;
  let fixture: ComponentFixture<SupportoActivitylog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoActivitylog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoActivitylog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
