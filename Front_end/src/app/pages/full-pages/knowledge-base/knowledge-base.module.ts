import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TruncatePipe } from './truncate.pipe';
import { KnowledgeBaseRoutingModule } from "./knowledge-base-routing.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { KnowledgeCategoriesComponent } from './knowledge-categories/knowledge-categories.component';
import { KnowledgeQuestionComponent } from './knowledge-question/knowledge-question.component';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { KnowledgeSearchComponent } from './knowledge-search/knowledge-search.component';
import { KnowledgeHistoryComponent } from './knowledge-history/knowledge-history.component';
@NgModule({
    imports: [
        CommonModule,
        KnowledgeBaseRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        SwiperModule,
        PipeModule
    ],
    declarations: [
        KnowledgeBaseComponent,
        KnowledgeSearchComponent,
        KnowledgeCategoriesComponent,
        KnowledgeQuestionComponent,
        KnowledgeHistoryComponent,
        TruncatePipe
        

    ],
})
export class KnowledgeBaseModule { }
