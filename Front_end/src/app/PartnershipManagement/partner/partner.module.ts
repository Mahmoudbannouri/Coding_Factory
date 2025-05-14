import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { AppComponent } from 'app/app.component';
import { ContentLayoutComponent } from 'app/layouts/content/content-layout.component';
import { FullLayoutComponent } from 'app/layouts/full/full-layout.component';
import { AddAgreementsComponent } from '../add-agreements/add-agreements.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { PartnershipModule } from '../partnership/partnership.module';
import { ProposalModule } from '../proposal/proposal.module';


@NgModule({
  declarations: [



   

  ],

  imports: [
    CommonModule,
    PartnerRoutingModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,  // Required for toastr animations

    ToastrModule.forRoot(),    // Required for toastr notifications
    PartnershipModule,

    ReactiveFormsModule,  // Include ReactiveFormsModule here

    FormsModule,         // ✅ Add this

    ReactiveFormsModule,

    ProposalModule,
    NgxSpinnerModule,
    
  ]
})
export class PartnerModule { }
