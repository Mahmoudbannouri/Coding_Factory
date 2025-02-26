import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesRoutingModule } from "./data-tables-routing.module";

import { DataTablesComponent } from './data-tables.component';
import { PipeModule } from 'app/shared/pipes/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        DataTablesRoutingModule,
        NgxDatatableModule,
        PipeModule
    ],
    declarations: [
      DataTablesComponent
    ]
})
export class DataTablesModule { }
