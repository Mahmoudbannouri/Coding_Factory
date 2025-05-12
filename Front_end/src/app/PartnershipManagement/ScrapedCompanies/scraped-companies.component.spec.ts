import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapedCompaniesComponent } from './scraped-companies.component';

describe('ScrapedCompaniesComponent', () => {
  let component: ScrapedCompaniesComponent;
  let fixture: ComponentFixture<ScrapedCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrapedCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrapedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
