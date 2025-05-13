import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

import { AuthGuard } from './shared/auth/auth-guard.service';
import {EntrepriseAddComponent} from './entreprise/entreprise/entreprise-add/entreprise-add.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { VerifyEmailHandlerComponent } from './pages/verify-email-handler/verify-email-handler.component';
import { VerificationSuccessComponent } from './pages/verification-success/verification-success.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: 'entreprise/add', component: EntrepriseAddComponent },

  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'verification-success', component: VerificationSuccessComponent },
  { 
    path: 'pages/verify-email-handler', 
    component: VerifyEmailHandlerComponent 
  },
  {
    path: 'entreprise',
    loadChildren: () => import('./entreprise/entreprise/entreprise.module').then(m => m.EntrepriseModule),
  },
  {
    path: 'partnership',
    loadChildren: () => import('./partnership/partnership.module').then(m => m.PartnershipModule),
  },
  {
    path: 'proposal',
    loadChildren: () => import('./proposal/proposal.module').then(m => m.ProposalModule),
  },

  {
    path: 'partnerships',
    loadChildren: () => import('./data-tables/data-tables.module').then(m => m.DataTablesModule),
  },

  {
    path: '**',
    redirectTo: 'pages/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
