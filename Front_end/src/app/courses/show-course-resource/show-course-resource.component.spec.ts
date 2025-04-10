import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCourseResourceComponent } from './show-course-resource.component';

describe('ShowCourseResourceComponent', () => {
  let component: ShowCourseResourceComponent;
  let fixture: ComponentFixture<ShowCourseResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCourseResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCourseResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
