import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChatRoutingModule } from "./chat-routing.module";
import { PipeModule } from 'app/shared/pipes/pipe.module';

import { ChatComponent } from "./chat.component";


@NgModule({
    imports: [
        CommonModule,
        ChatRoutingModule,
        NgbModule,
        FormsModule,
        PerfectScrollbarModule,
        PipeModule
    ],
    declarations: [
        ChatComponent
    ]
})
export class ChatModule { }
