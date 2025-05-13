import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnershipComponent } from './partnership.component';
import { PartnershipEditComponent } from './partnership-edit/partnership-edit.component';

const routes: Routes = [
  { path: '', component: PartnershipComponent },
  { path: 'edit/:id', component: PartnershipEditComponent },
  { path: 'add', component: PartnershipEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnershipRoutingModule { }