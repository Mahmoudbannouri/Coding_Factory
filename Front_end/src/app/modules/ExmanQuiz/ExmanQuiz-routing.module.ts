import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExmanQuizComponent } from './ExmanQuiz.component';

const routes: Routes = [
    {
        path: '',
        component: ExmanQuizComponent,
        data: {
            title: 'ExmanQuiz'
        },

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExmanQuizRoutingModule { }

export const routedComponents = [ExmanQuizComponent];