import { Component, OnInit } from '@angular/core';
import { Course } from 'app/models/courses';
import { CourseService } from 'app/services/course.service';
import { StorageService } from 'app/shared/auth/storage.service';

@Component({
  selector: 'app-enroll-student-courses',
  templateUrl: './enroll-student-courses.component.html',
  styleUrls: ['./enroll-student-courses.component.scss']
})
export class EnrollStudentCoursesComponent implements OnInit {
  activeTab: string = 'all';
  enrolledCourses: Course[] = [];

 
  constructor(    private storageService: StorageService,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    const studentId = StorageService.getUserId();
    this.courseService.getEnrolledCoursesByStudent(studentId).subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cours :', error);
      }
    });
  }
  getFile(fileName: string): string {
    if (fileName.startsWith('https://')) {
      return fileName;
    }
    return `https://wbptqnvcpiorvwjotqwx.supabase.co/storage/v1/object/public/course-images/${fileName}`;
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

 

  
}
