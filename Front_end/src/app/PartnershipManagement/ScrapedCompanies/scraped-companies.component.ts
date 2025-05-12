import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrapedCompany } from '../models/ScrapedCompany';
import { PredictionService } from '../services/prediction.service';
import { ScrapingService } from '../services/scraping.service';


@Component({
  selector: 'app-scraped-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scraped-companies.component.html',
  styleUrls: ['./scraped-companies.component.scss']
})
export class ScrapedCompaniesComponent implements OnInit {
  scrapedCompanies: ScrapedCompany[] = [];
  loading = true;
  error = '';
  question = '';
  answer: any = null;

  constructor(
    private scrapedCompanyService: ScrapingService,
    private predictionService: PredictionService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.scrapedCompanyService.getScrapedCompanies().subscribe({
      next: (data) => {
        this.scrapedCompanies = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load companies.';
        this.loading = false;
      }
    });
  }

  getAndSavePrediction(companyId: number): void {
    this.predictionService.getAndSavePredictionByCompanyId(companyId).subscribe({
      next: (data) => {
        const company = this.scrapedCompanies.find(c => c.id === companyId);
        if (company) {
          company.elegible = data.eligible;
          company.eligibility_precentage = data.probability;
          this.loadCompanies();
        }
      },
      error: (err) => {
        this.error = 'Failed to get prediction.';
      }
    });
  }

  sortByProbability(): void {
    this.scrapedCompanies.sort((a, b) => b.eligibility_precentage - a.eligibility_precentage);
  }

  predictAllCompaniesEligibility(): void {
    this.predictionService.predictAllCompaniesEligibility().subscribe({
      next: () => {
        this.scrapedCompanyService.getScrapedCompanies().subscribe({
          next: (data) => {
            this.scrapedCompanies = data;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to refresh companies.';
            this.loading = false;
          }
        });
        this.error = 'All companies eligibility predicted successfully.';
      },
      error: (err) => {
        this.error = 'Failed to predict all companies eligibility.';
      }
    });
  }

  resetEligibility(): void {
    this.scrapedCompanyService.resetElegibility().subscribe({
      next: (response) => {
        console.log('Eligibility reset:', response);
        alert('All companies have been reset successfully.');
        this.loadCompanies();
      },
      error: (error) => {
        console.error('Error resetting eligibility:', error);
        alert('An error occurred while resetting.');
      }
    });
  }

  askQuestion(): void {
    if (this.question.trim() === '') {
      this.answer = { answer: 'Please enter a question.' };
      return;
    }

    this.scrapedCompanyService.askQuestion(this.question).subscribe({
      next: (response) => {
        this.answer = response;
      },
      error: (err) => {
        this.answer = { answer: 'Error asking question. Please try again.' };
        console.error('Error asking question:', err);
      }
    });
  }

  closePopup(): void {
    this.answer = null;
  }
}
