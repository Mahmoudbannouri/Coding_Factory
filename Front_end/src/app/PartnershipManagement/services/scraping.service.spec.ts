import { TestBed } from '@angular/core/testing';
import { ScrapingService } from './scraping.service'; // Adjust the import path as necessary

describe('ScrapingService', () => {
  let service: ScrapingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrapingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});