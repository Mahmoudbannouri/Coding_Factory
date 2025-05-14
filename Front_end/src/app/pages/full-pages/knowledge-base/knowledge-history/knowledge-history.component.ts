import { Component, OnInit } from '@angular/core';
import { ChatbotService } from 'app/services/Chatbot.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-knowledge-history',
  templateUrl: './knowledge-history.component.html',
  styleUrls: ['./knowledge-history.component.scss'],
  providers: [DatePipe]
})
export class KnowledgeHistoryComponent implements OnInit {
  history: any[] = [];
  filteredHistory: any[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';
  selectedHistory: any = null;
  feedbackText = '';
  pageSizeOptions = [5, 10, 25, 50];
  errorMessage: string;
  isLoading: boolean;

  constructor(
    private chatbotService: ChatbotService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
      // Ajout pour debug
    this.loadHistory();
  }

// Dans knowledge-history.component.ts
loadHistory(): void {
  this.isLoading = true;
  this.errorMessage = '';
  
  this.chatbotService.getChatHistory(this.currentPage, this.pageSize)
    .subscribe({
      next: (response) => {
        this.history = response.content || [];
        this.totalItems = response.totalElements || 0;
        this.filterHistory();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur de chargement. Rechargement dans 5s...';
        setTimeout(() => this.loadHistory(), 5000);
      }
    });
}
  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadHistory();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadHistory();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  filterHistory(): void {
    if (this.searchTerm) {
      this.chatbotService.getFeedbacks(this.searchTerm)
        .subscribe({
          next: (feedbacks) => {
            this.filteredHistory = feedbacks;
          },
          error: (err) => console.error('Error filtering history:', err)
        });
    } else {
      this.filteredHistory = [...this.history];
    }
  }

  selectHistory(item: any): void {
    this.selectedHistory = item;
    this.feedbackText = item.feedback || '';
  }

  saveFeedback(): void {
    if (!this.selectedHistory) return;

    this.chatbotService.saveFeedback(this.selectedHistory.id, this.feedbackText)
      .subscribe({
        next: () => {
          this.loadHistory();
          this.selectedHistory.feedback = this.feedbackText;
        },
        error: (err) => console.error('Error saving feedback:', err)
      });
  }

  formatDate(isoDate: string): string {
    return this.datePipe.transform(isoDate, 'dd/MM/yyyy HH:mm') || 'Date invalide';
  }
  goToChat(): void {
    this.router.navigate(['/chat']);
  }
}