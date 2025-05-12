import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesComponent } from './data-tables.component';

const routes: Routes = [
  {
    path: '',
    component: DataTablesComponent,
    data: {
      title: 'Partnerships'
    }
  },
  {
    path: 'add',
    component: DataTablesComponent, // Reusing DataTablesComponent for the add form
    data: {
      title: 'Add Partnership'
    }
  },
  {
    path: 'edit/:id',
    component: DataTablesComponent, // Reusing DataTablesComponent for the edit form
    data: {
      title: 'Edit Partnership'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataTablesRoutingModule {}
