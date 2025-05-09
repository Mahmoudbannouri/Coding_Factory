import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollStudentCoursesComponent } from './enroll-student-courses.component';

describe('EnrollStudentCoursesComponent', () => {
  let component: EnrollStudentCoursesComponent;
  let fixture: ComponentFixture<EnrollStudentCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollStudentCoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollStudentCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
