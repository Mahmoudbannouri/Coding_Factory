import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnershipRoutingModule } from './partnership-routing.module';
import { PartnershipComponent } from './partnership.component';
import { PartnershipEditComponent } from './partnership-edit/partnership-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    PartnershipComponent,
    PartnershipEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PartnershipRoutingModule,
    NgxSpinnerModule
  ]
})
export class PartnershipModule { }