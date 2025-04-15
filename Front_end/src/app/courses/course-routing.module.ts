import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from './course.component';
import { EnrollStudentCoursesComponent } from './enroll-student-courses/enroll-student-courses.component';

const routes: Routes = [
  {
    path: '',
    component: CourseComponent,
    data: {
      title: 'Courses'
    },
    
  },
  {
    path: 'enroll-courses',  // Le chemin pour accéder à ton nouveau composant
    component: EnrollStudentCoursesComponent,
    data: {
      title: 'enroll'
    },
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule { }

export const routedComponents = [CourseComponent];
