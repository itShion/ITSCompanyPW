import { TestBed } from '@angular/core/testing';
import { NotificaService } from './notifica-service';
import { PrenotaService } from './prenota-service';

describe('NotificaService', () => {
  let service: NotificaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
