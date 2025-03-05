import { TestBed } from '@angular/core/testing';

import { GeminiAIServiceService } from './gemini-aiservice.service';

describe('GeminiAIServiceService', () => {
  let service: GeminiAIServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiAIServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
