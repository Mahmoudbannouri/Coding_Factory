import { TestBed } from '@angular/core/testing';

import { StudentPerformanceService } from './student-performance.service';

describe('StudentPerformanceService', () => {
  let service: StudentPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
