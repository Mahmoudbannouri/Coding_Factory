import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseComponent } from './entreprise.component';
import { EntrepriseAddComponent } from './entreprise-add/entreprise-add.component';

const routes: Routes = [
  { path: '', component: EntrepriseComponent },
  { path: 'add', component: EntrepriseAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntrepriseRoutingModule {}