import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

import { AuthGuard } from './shared/auth/auth-guard.service';

import { AddAgreementsComponent } from './PartnershipManagement/add-agreements/add-agreements.component';
import { EntrepriseAddComponent } from './PartnershipManagement/entreprise/entreprise/entreprise-add/entreprise-add.component';
import { ScrapingComponent } from './PartnershipManagement/WebScraping/scraping.component';
import { ScrapedCompaniesComponent } from './PartnershipManagement/ScrapedCompanies/scraped-companies.component';
import { PartnershipDetailsComponent } from './PartnershipManagement/partnership/partnership-details/partnership-details.component';
import { PotentialPartnersComponent } from './PartnershipManagement/potentialpartners/potentialpartners.component';
import { TimelineVerticalCenterPageComponent } from './pages/full-pages/timeline/vertical/timeline-vertical-center-page/timeline-vertical-center-page.component';
import { InvoicePageComponent } from './pages/full-pages/invoice/invoice-page.component';

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
    canActivate: [AuthGuard],
    children: [
      ...Full_ROUTES,
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
        canActivate: [AuthGuard], // Ensure AuthGuard is applied
        data: { roles: ['ADMIN'] } // Specify that this route is only accessible to admins
      },
      {
        path: 'proposal',
        loadChildren: () => import('./PartnershipManagement/proposal/proposal.module').then(m => m.ProposalModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./PartnershipManagement/chat/chat.module').then(m => m.ChatModule),
        canActivate: [AuthGuard], // Ensure AuthGuard is applied
        data: { roles: ['ADMIN'] } // Specify that this route is only accessible to admins
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
      }
    ]
  },
  {
    path: '',
    component: ContentLayoutComponent,
    data: { title: 'content Views' },
    children: CONTENT_ROUTES
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
export class AppRoutingModule { }
