import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ExmanQuizRoutingModule } from "./ExmanQuiz-routing.module";
import { PipeModule } from 'app/shared/pipes/pipe.module';

import {  ExmanQuizComponent } from "./ExmanQuiz.component";
import { QuillModule } from 'ngx-quill';
import { ExamRoutingModule } from '../exams/Exam-routing.module';


@NgModule({
    imports: [
                CommonModule,
                ExmanQuizRoutingModule,
                NgbModule,
                QuillModule.forRoot(),
                FormsModule,
                PerfectScrollbarModule,
                PipeModule
        
    ],
    declarations: [
        ExmanQuizComponent
    ]
})
export class ExmanQuizModule { }
