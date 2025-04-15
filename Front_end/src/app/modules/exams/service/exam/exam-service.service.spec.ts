import { TestBed } from '@angular/core/testing';

import { ExamServiceService } from './exam-service.service';

describe('ExamServiceService', () => {
  let service: ExamServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
