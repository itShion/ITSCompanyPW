import { TestBed } from '@angular/core/testing';

import { UtilsReportService } from './utils-report-service';

describe('UtilsReportService', () => {
  let service: UtilsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
