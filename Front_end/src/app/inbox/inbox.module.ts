import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';

import { InboxRoutingModule } from "./inbox-routing.module";
import { PipeModule } from 'app/shared/pipes/pipe.module';

import { InboxComponent } from "./inbox.component";


@NgModule({
    imports: [
        CommonModule,
        InboxRoutingModule,
        NgbModule,
        QuillModule.forRoot(),
        FormsModule,
        PerfectScrollbarModule,
        PipeModule
    ],
    declarations: [
        InboxComponent
    ]
})
export class InboxModule { }
