import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProposalRoutingModule } from './proposal-routing.module';
import { ProposalComponent } from './proposal.component';
import { ProposalEditComponent } from './proposal-edit/proposal-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    ProposalComponent,
    ProposalEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProposalRoutingModule,
    NgxSpinnerModule
  ]
})
export class ProposalModule { }
