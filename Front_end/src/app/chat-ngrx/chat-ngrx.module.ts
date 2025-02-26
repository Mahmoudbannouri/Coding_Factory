import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChatNGRXRoutingModule } from "./chat-ngrx-routing.module";
import { PipeModule } from 'app/shared/pipes/pipe.module';

import { ChatComponent } from "./chat-ngrx.component";
import { chatReducer } from '../chat-ngrx/store/chat.reducers';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChatNGRXRoutingModule,
        NgbModule,
        PerfectScrollbarModule,
        PipeModule,
        StoreModule.forFeature('chat', chatReducer),
    ],
    declarations: [
        ChatComponent
    ]
})
export class ChatNGRXModule { }
