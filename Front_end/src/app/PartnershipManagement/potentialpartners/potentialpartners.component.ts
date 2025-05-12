  import { Component, OnInit } from '@angular/core';
  import { Router, NavigationStart, NavigationEnd, NavigationExtras } from '@angular/router';
  import Swal from 'sweetalert2';  // SweetAlert2 import for notifications
import { DataService } from '../services/DataService';
import { ScrapingService } from '../services/scraping.service';

  @Component({
    selector: 'app-potentialpartners',
    templateUrl: './potentialpartners.component.html',
    styleUrls: ['./potentialpartners.component.scss']
  })
  export class PotentialPartnersComponent implements OnInit {
    top5Results: any[] = [];

    constructor(private router: Router,private scrapingService: ScrapingService,
      private dataService: DataService
    ) {}

    ngOnInit(): void {
      // Show SweetAlert notification when the page loads
      const swalInstance = Swal.fire({
          title: 'Searching for Potential Partners...',
          text: 'Please be patient this takes around 40 seconds.',
          timer: 40000,  // Auto-close after 30 seconds
          timerProgressBar: true,
          didOpen: () => {
              Swal.showLoading();
              // Custom CSS for the loading progress bar color
              const progressBar = document.querySelector('.swal2-timer-progress-bar') as HTMLElement;
              if (progressBar) {
                  progressBar.style.backgroundColor = '#007bff'; // Blue color for the progress bar
              }
          },
          willClose: () => {
              console.log('Search process finished or timeout reached.');
          },
          background: '#f8f9fa',  // Light background
          customClass: {
              container: 'container-alert',  // Custom class for styling
              popup: 'popup-alert'  // Custom class for popup
          }
      });
  
      this.dataService.top5Results$.subscribe(top5 => {
          if (top5.length > 0) {
              this.top5Results = top5;
              console.log('Received Top 5 from service:', this.top5Results);
          } else {
              this.scrapingService.getTop5RelevantCompanies().subscribe(data => {
                  this.top5Results = data;
                  console.log('✅ Top 5 from API:', this.top5Results);
              });
          }
      });
  }
  
    
    getRelevanceClass(relevance: number): string {
      if (relevance >= 70) {
        return 'bg-success text-white'; // Green
      } else if (relevance >= 60) {
        return 'bg-warning text-dark'; // Yellow
      } else {
        return 'bg-danger text-white'; // Red
      }
    }
    
    openContact(contactUrl: string): void {
      if (contactUrl) {
          window.open(`mailto:${contactUrl}`, '_blank');  // Opens the default email client
      } else {
          console.error('No contact URL available');
      }
  }
  
    
    getIconForTag(tag: string): string {
      const iconsMap: { [key: string]: string } = {
        'AI': 'fas fa-robot',
        'education': 'fas fa-graduation-cap',
        'partnership': 'fas fa-handshake',
        'collaboration': 'fas fa-people-arrows',
        'innovation': 'fas fa-lightbulb',
        'enterprise': 'fas fa-building',
        'software': 'fas fa-code',
        'development': 'fas fa-laptop-code',
        'front end': 'fas fa-desktop'
      };
      return iconsMap[tag.toLowerCase()] || 'fas fa-tag';
    }
    
    getColorForTag(tag: string, index: number): string {
      const colors = ['primary', 'success', 'warning', 'danger', 'info', 'secondary', 'dark'];
      return colors[index % colors.length];
    }
    getMailToLink(item: any): string {
      const subject = encodeURIComponent(`Excited to Connect with ${item.Title}`);
    
    
      const body = encodeURIComponent(
        `Hi ${item.Title} team,\n\n` +
        `I found your company through our partner search and I'm interested in exploring potential collaboration opportunities.\n\n` +
        `Looking forward to hearing from you!\n\n` +
        `-- \n` +
        `Rabie Zerrim\n` +
        `Partnership Manager\n` +
        `📧 rabie.zerrim@example.com\n` +
        `📞 +212 6 00 00 00 00\n` +
        `🌐 www.HR@CodingFactory.com\n\n` +
        `Best regards,\n` +
        `Rabie Zerrim`
      );
      
    
      return `mailto:${item.Contact}?subject=${subject}&body=${body}`;
    }
    
    
  }
