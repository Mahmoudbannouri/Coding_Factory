import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollStudentsModalComponent } from './enroll-students-modal.component';

describe('EnrollStudentsModalComponent', () => {
  let component: EnrollStudentsModalComponent;
  let fixture: ComponentFixture<EnrollStudentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollStudentsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollStudentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
