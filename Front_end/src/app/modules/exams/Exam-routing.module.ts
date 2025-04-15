import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamComponent } from './exam.component';
const routes: Routes = [
  {
    path: '',
    component: ExamComponent,
    data: {
      title: 'Exams'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamRoutingModule { }

export const routedComponents = [ExamComponent];
