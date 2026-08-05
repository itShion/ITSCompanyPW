import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SupportoSidebar } from './supporto-sidebar';

describe('SupportoSidebar', () => {
  let component: SupportoSidebar;
  let fixture: ComponentFixture<SupportoSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportoSidebar],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportoSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
