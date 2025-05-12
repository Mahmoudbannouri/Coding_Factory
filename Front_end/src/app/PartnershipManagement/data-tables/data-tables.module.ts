import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesRoutingModule } from "./data-tables-routing.module";
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesComponent } from './data-tables.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DataTablesRoutingModule,
    NgxDatatableModule,
    PipeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DataTablesComponent  // <-- Add this
  ]
})
export class DataTablesModule { }