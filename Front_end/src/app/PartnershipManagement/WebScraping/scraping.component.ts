import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';  // SweetAlert2 import for notifications
import { ScrapingService } from '../services/scraping.service';

@Component({
  selector: 'app-scraping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scraping.component.html',
  styleUrls: ['./scraping.component.scss']
})
export class ScrapingComponent implements OnInit {
  scrapedData: any[] = [];
  filteredData: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';

  constructor(private scrapingService: ScrapingService,
              private sanitizer: DomSanitizer,
              private router: Router) {}

  ngOnInit(): void {
    // Show SweetAlert notification when the page loads
    Swal.fire({
      title: 'Searching for Potential Partners...',
      text: 'Please be patient as we find the best partners for you.',
      timer: 30000,  // Auto-close after 30 seconds
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        console.log('Search process finished or timeout reached.');
      }
    });

    // Call method to get scraped data
    this.getScrapedData();
  }

  // Fetch the data
  getScrapedData(): void {
    this.isLoading = true;
    this.scrapingService.getScrapedData().subscribe(
      (data) => {
        this.scrapedData = data;
        this.filteredData = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching data';
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  // Search functionality
  onSearch(): void {
    if (this.searchTerm) {
      this.filteredData = this.scrapedData.filter(item =>
        (item.Title && item.Title.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.Description && item.Description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      this.filteredData = [...this.scrapedData];  // Reset data when search term is cleared
    }
  }

  // Sort by Highest Score
  filterByHighestScore(): void {
    this.filteredData = [...this.scrapedData].sort((a, b) => b.Score - a.Score);
  }

  // Filter by Most Popular (Reviews)
  filterByMostPopular(): void {
    this.filteredData = [...this.scrapedData].sort((a, b) => b.Reviews - a.Reviews);
  }

 
  // Highlight searched text in Titles and Descriptions
  highlightText(text: string, search: string): SafeHtml {
    if (!search) return text;
    // Create a regular expression to find the search term (case-insensitive)
    const regex = new RegExp(search, 'gi');
    // Replace matches with a span tag
    const highlighted = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  // Navigation to Top 5 Results (if needed)
  navigateToTop5Results(): void {
    const top5 = this.filteredData.slice(0, 5);
    console.log('Navigating with Top 5:', top5);
    this.router.navigate(['/potentialpartners'], { state: { top5 } });
  }

  // Fetch top 5 relevant companies
  getTop5RelevantCompanies(): void {
    this.isLoading = true;
    this.scrapingService.getTop5RelevantCompanies().subscribe(
      (data) => {
        console.log('Top 5 Companies:', data);
        this.scrapedData = data;
        this.filteredData = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching data';
        this.isLoading = false;
        console.error(error);
      }
    );
  }
}
