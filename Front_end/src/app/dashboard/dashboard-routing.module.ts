import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Dashboard1Component } from "./dashboard1/dashboard1.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";
import { NoAuthGuard } from 'app/guards/no-auth.guard'; // Ensure the correct path

const routes: Routes = [
  {
    path: 'dashboard1',
    component: Dashboard1Component,
    canActivate: [NoAuthGuard],  // Protect for Admin users
    data: { title: 'Dashboard 1 (Admin)' }
  },
  {
    path: 'dashboard2',
    component: Dashboard2Component,
    canActivate: [NoAuthGuard],  // Protect for Regular users
    data: { title: 'Dashboard 2 (User)' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
