import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformancePredictionComponent } from './performance-prediction.component';

describe('PerformancePredictionComponent', () => {
  let component: PerformancePredictionComponent;
  let fixture: ComponentFixture<PerformancePredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformancePredictionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformancePredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
