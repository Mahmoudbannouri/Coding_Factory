import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicePageComponent } from 'app/pages/full-pages/invoice/invoice-page.component';
import { AddAgreementsComponent } from '../add-agreements/add-agreements.component';
import { TimelineVerticalCenterPageComponent } from 'app/pages/full-pages/timeline/vertical/timeline-vertical-center-page/timeline-vertical-center-page.component';
import { EntrepriseAddComponent } from '../entreprise/entreprise/entreprise-add/entreprise-add.component';
import { PartnershipDetailsComponent } from '../partnership/partnership-details/partnership-details.component';
import { PotentialPartnersComponent } from '../potentialpartners/potentialpartners.component';
import { ScrapedCompaniesComponent } from '../ScrapedCompanies/scraped-companies.component';
import { ScrapingComponent } from '../WebScraping/scraping.component';

const routes: Routes = [
  { path: 'invoice/:id', component: InvoicePageComponent },
  { path: 'partnerships/:id/add-agreements', component: AddAgreementsComponent },
  { path: 'entreprise/add', component: EntrepriseAddComponent },
  { path: 'scraping', component: ScrapingComponent },
  { path: 'scrapedCompanies', component: ScrapedCompaniesComponent },
  { path: 'partnership-details/:id', component: PartnershipDetailsComponent },
  { path: 'partnerships', redirectTo: '/partnerships', pathMatch: 'full' }, // optional: might be redundant
  { path: 'potentialpartners', component: PotentialPartnersComponent },
  { path: 'TimelineVerticalCenterPage', component: TimelineVerticalCenterPageComponent },
  { path: 'assessments', redirectTo: '/assessments' } // optional: might need target module/component
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule {}
