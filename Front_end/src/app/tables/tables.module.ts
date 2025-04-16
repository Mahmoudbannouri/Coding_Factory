import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TablesRoutingModule } from "./tables-routing.module";

import { ExtendedTableComponent } from "./extended/extended-table.component";
import { BasicComponent } from './basic/basic.component';
import { TablesComponent } from './angular/tables.component';
import { NgbdSortableHeader } from './angular/sortable.directive';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        TablesRoutingModule
    ],
    declarations: [
        ExtendedTableComponent,
        BasicComponent,
        TablesComponent,
        NgbdSortableHeader,
    ]
})
export class TablesModule { }
