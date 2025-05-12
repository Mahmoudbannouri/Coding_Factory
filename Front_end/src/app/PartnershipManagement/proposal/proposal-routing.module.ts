import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalComponent } from './proposal.component';
import { ProposalEditComponent } from './proposal-edit/proposal-edit.component';

const routes: Routes = [
  { path: '', component: ProposalComponent },
  { path: 'edit/:id', component: ProposalEditComponent },
  { path: 'add', component: ProposalEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }
