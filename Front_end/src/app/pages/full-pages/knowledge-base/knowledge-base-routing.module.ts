import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { KnowledgeSearchComponent } from './knowledge-search/knowledge-search.component';
import { KnowledgeCategoriesComponent } from './knowledge-categories/knowledge-categories.component';
import { KnowledgeQuestionComponent } from './knowledge-question/knowledge-question.component';

const routes: Routes = [
  {
    path: '', component: KnowledgeBaseComponent, children: [
      { path: "", redirectTo: "search", pathMatch: "full" },
      {
        path: 'search',
        component: KnowledgeSearchComponent
      },
      {
        path: 'categories',
        component: KnowledgeCategoriesComponent
      },
      {
        path: 'questions',
        component: KnowledgeQuestionComponent
      },

    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeBaseRoutingModule { }
