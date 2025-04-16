import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicComponent } from "./basic/basic.component";
import { ExtendedTableComponent } from "./extended/extended-table.component";
import { TablesComponent } from './angular/tables.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic',
        component: BasicComponent,
        data: {
          title: 'Basic Table'
        }
      },
      {
        path: 'extended',
        component: ExtendedTableComponent,
        data: {
          title: 'Extended Table'
        }
      },
      {
        path: 'tables',
        component: TablesComponent,
        data: {
          title: 'Angular Table'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }
