import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

import { AuthGuard } from './shared/auth/auth-guard.service';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { VerifyEmailHandlerComponent } from './pages/verify-email-handler/verify-email-handler.component';
import { VerificationSuccessComponent } from './pages/verification-success/verification-success.component';
import {InvoicePageComponent} from './pages/full-pages/invoice/invoice-page.component';
import {
  TimelineVerticalCenterPageComponent
} from './pages/full-pages/timeline/vertical/timeline-vertical-center-page/timeline-vertical-center-page.component';
import {AddAgreementsComponent} from './PartnershipManagement/add-agreements/add-agreements.component';
import {PotentialPartnersComponent} from './PartnershipManagement/potentialpartners/potentialpartners.component';
import {PartnershipDetailsComponent} from './PartnershipManagement/partnership/partnership-details/partnership-details.component';
import {ScrapedCompaniesComponent} from './PartnershipManagement/ScrapedCompanies/scraped-companies.component';
import {ScrapingComponent} from './PartnershipManagement/WebScraping/scraping.component';
import {data} from './shared/data/smart-data-table';
import {EntrepriseAddComponent} from './PartnershipManagement/entreprise/entreprise/entreprise-add/entreprise-add.component';
import { Module } from 'module';
import { ExamModule } from './modules/exams/exam.module';
import { ExmanQuizModule } from './modules/ExmanQuiz/ExmanQuiz.module';
const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: { title: 'full Views' },
    children: Full_ROUTES,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ContentLayoutComponent,
    data: { title: 'content Views' },
    children: CONTENT_ROUTES
  },
  { path: 'entreprise/add', component: EntrepriseAddComponent },

  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'verification-success', component: VerificationSuccessComponent },
  {
    path: 'pages/verify-email-handler',
    component: VerifyEmailHandlerComponent
  },
  {
    path: 'partnerships',
    loadChildren: () => import('./PartnershipManagement/data-tables/data-tables.module').then(m => m.DataTablesModule)
  },
  {
    path: 'partnership',
    loadChildren: () => import('./PartnershipManagement/partnership/partnership.module').then(m => m.PartnershipModule)
  },
  {
    path: 'entreprise',
    loadChildren: () => import('./PartnershipManagement/entreprise/entreprise/entreprise.module').then(m => m.EntrepriseModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'proposal',
    loadChildren: () => import('./PartnershipManagement/proposal/proposal.module').then(m => m.ProposalModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./PartnershipManagement/chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'scraping',
    component: ScrapingComponent
  },
  {
    path: 'scrapedCompanies',
    component: ScrapedCompaniesComponent
  },
  {
    path: 'partnership-details/:id',
    component: PartnershipDetailsComponent
  },
  {
    path: 'potentialpartners',
    component: PotentialPartnersComponent
  },
  {
    path: 'partnerships/:id/add-agreements',
    component: AddAgreementsComponent
  },
  {
    path: 'entreprise/add',
    component: EntrepriseAddComponent
  },
  {
    path: 'TimelineVerticalCenterPage',
    component: TimelineVerticalCenterPageComponent
  },
  {
    path: 'invoice/:id',
    component: InvoicePageComponent
  },
  {
    path: '**',
    redirectTo: 'pages/error'
  },
  {
  path: 'modules',
  children: [
    {
      path: 'exams', // accès via /modules/exams
      loadChildren: () => import('./modules/exams/exam.module').then(m => m.ExamModule)
    },
    {
      path: 'exman-quiz', // accès via /modules/exman-quiz
      loadChildren: () => import('./modules/ExmanQuiz/ExmanQuiz.module').then(m => m.ExmanQuizModule)
    }
  ]
}
];






@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
