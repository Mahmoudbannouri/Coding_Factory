import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';

import { CourseRoutingModule } from "./course-routing.module";
import { PipeModule } from 'app/shared/pipes/pipe.module';

import { CourseComponent } from "./course.component";
import { AddCourseResourceComponent } from './add-course-resource/add-course-resource.component';
import { ShowCourseResourceComponent } from './show-course-resource/show-course-resource.component';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { EditCourseModalComponent } from './edit-course-modal/edit-course-modal.component';
import { EnrollStudentsModalComponent } from './enroll-students-modal/enroll-students-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShowStudentsModalComponent } from './show-students-modal/show-students-modal.component';
import { ReviewModalComponent } from './review-modal/review-modal.component';
import { AIImprovementsModalComponent } from './aiimprovements-modal/aiimprovements-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        CommonModule,
        CourseRoutingModule,
        NgbModule,
        QuillModule.forRoot(),
        FontAwesomeModule,
        FormsModule,
        PerfectScrollbarModule,
        PipeModule,
        NgSelectModule
    ],
    declarations: [
        CourseComponent,
        AddCourseResourceComponent,
        ShowCourseResourceComponent,
        AddCourseModalComponent,
        EditCourseModalComponent,
        EnrollStudentsModalComponent,
        ShowStudentsModalComponent,
        ReviewModalComponent,
        AIImprovementsModalComponent
    ]
})
export class CourseModule { }
