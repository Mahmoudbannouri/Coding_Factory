import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';

import { PipeModule } from 'app/shared/pipes/pipe.module';

import { Exam } from './model/exam/exam';
import { AddexamModalComponent } from './add-exam-modal/add-exam-modal.component';
import { EditexamModalComponent } from './edit-exam-modal/edit-exam-modal.component';
import { ExamRoutingModule } from './Exam-routing.module';
import { ExamComponent } from './exam.component';
import { AddquizModalComponent } from './add-quiz-modal/add-quiz-modal.component';


@NgModule({
    imports: [
        CommonModule,
        ExamRoutingModule,
        NgbModule,
        QuillModule.forRoot(),
        FormsModule,
        PerfectScrollbarModule,
        PipeModule
    ],
    declarations: [
        AddexamModalComponent,
        EditexamModalComponent,
        ExamComponent,
        AddquizModalComponent,


    ]
})
export class ExamModule { }
Exam