import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIImprovementsModalComponent } from './aiimprovements-modal.component';

describe('AIImprovementsModalComponent', () => {
  let component: AIImprovementsModalComponent;
  let fixture: ComponentFixture<AIImprovementsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AIImprovementsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AIImprovementsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
