import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';

import { CourseRoutingModule } from "./course-routing.module";
import { PipeModule } from 'app/shared/pipes/pipe.module';

import { CourseComponent } from "./course.component";


@NgModule({
    imports: [
        CommonModule,
        CourseRoutingModule,
        NgbModule,
        QuillModule.forRoot(),
        FormsModule,
        PerfectScrollbarModule,
        PipeModule
    ],
    declarations: [
        CourseComponent
    ]
})
export class CourseModule { }
