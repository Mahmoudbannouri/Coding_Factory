import { TestBed } from '@angular/core/testing';

import { AgreementService } from './agreements.service';

describe('AgreementsService', () => {
  let service: AgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgreementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
