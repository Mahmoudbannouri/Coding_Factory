import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent } from './event.component';


const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      title: 'Events'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule { }

export const routedComponents = [EventComponent];
