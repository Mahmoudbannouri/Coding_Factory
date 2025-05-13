import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';


import { PipeModule } from 'app/shared/pipes/pipe.module';

import { DatePipe } from '@angular/common'; // Import DatePipe
import { EventComponent } from './event.component';
import { EventRoutingModule } from './event-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        QuillModule.forRoot(),
        FormsModule,
        PerfectScrollbarModule,
        PipeModule,
        EventRoutingModule,
        NgxPaginationModule
    ],
    declarations: [
        EventComponent
    ],
    providers: [DatePipe],
})
export class EventModule { }
