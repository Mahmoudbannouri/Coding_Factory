import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceResultsComponent } from './performance-results.component';

describe('PerformanceResultsComponent', () => {
  let component: PerformanceResultsComponent;
  let fixture: ComponentFixture<PerformanceResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
