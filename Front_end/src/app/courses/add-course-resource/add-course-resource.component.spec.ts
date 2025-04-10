import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseResourceComponent } from './add-course-resource.component';

describe('AddCourseResourceComponent', () => {
  let component: AddCourseResourceComponent;
  let fixture: ComponentFixture<AddCourseResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCourseResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourseResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
