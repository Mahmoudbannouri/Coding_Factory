import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Course } from '../../models/courses';
import { ReviewService } from '../../services/review';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ai-improvements-modal',
  templateUrl: './aiimprovements-modal.component.html',
  styleUrls: ['./aiimprovements-modal.component.scss'],
})
export class AIImprovementsModalComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedCourse!: Course;
  @Output() showModalChange = new EventEmitter<boolean>();

  recommendations: string | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    if (this.selectedCourse) {
      this.fetchRecommendations();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCourse'] && this.selectedCourse) {
      this.fetchRecommendations();
    }
  }

  fetchRecommendations(): void {
    this.loading = true;
    this.error = null;
    this.reviewService.getAIRecommendations(this.selectedCourse.id).subscribe(
      (response: any) => {
        if (response && response.recommendations) {
          this.recommendations = response.recommendations;
        } else {
          this.recommendations = 'No recommendations available for this course.';
        }
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load recommendations. Please try again later.';
        this.loading = false;
      }
    );
  }

  formatRecommendations(recommendations: string): { title: string, text: string }[] {
    const formattedRecommendations: { title: string, text: string }[] = [];
    const lines = recommendations.split('\n');
  
    for (const line of lines) {
      if (line.trim().startsWith("Professor,")) {
        formattedRecommendations.push({
          title: "Suggestion",
          text: line.trim()
        });
      } else if (line.trim().startsWith("*")) {
        formattedRecommendations.push({
          title: "Actionable Advice",
          text: line.trim().replace("*", "").trim()
        });
      } else if (line.trim().startsWith("-")) {
        formattedRecommendations.push({
          title: "Technical Advice",
          text: line.trim().replace("-", "").trim()
        });
      }
    }
  
    // If no recommendations are found, return a default message
    if (formattedRecommendations.length === 0) {
      formattedRecommendations.push({
        title: 'General Suggestions',
        text: ''
      });
    }
  
    return formattedRecommendations;
  }
  // Helper method to format text: make content between ** bold and blue, and remove **
  formatText(text: string): string {
    if (!text) return '.';
  
    // Replace **content** with <strong style="color: #007bff;">content</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #007bff;">$1</strong>');
  
    // Make text between . and : bold
    text = text.replace(/(\.\s*)(.*?)(:)/g, '$1<strong>$2</strong>$3');
  
    return text;
  } 

  removeRecommendation(recommendation: { title: string, text: string }): void {
    console.log("Deleting recommendation:", recommendation); // Debugging
    // Call the service to delete the recommendation from the database
    this.reviewService.deleteRecommendation(this.selectedCourse.id, recommendation.text).subscribe(
        () => {
            console.log("Recommendation deleted successfully from the database."); // Debugging
            // Remove the recommendation from the UI
            const formattedRecommendations = this.formatRecommendations(this.recommendations || '');
            const updatedRecommendations = formattedRecommendations.filter(
                (rec) => rec.title !== recommendation.title || rec.text !== recommendation.text
            );

            // Convert the updated recommendations back to a string
            this.recommendations = updatedRecommendations
                .map((rec) => `*${rec.title}**${rec.text}`)
                .join('\n');

            console.log("Updated recommendations:", this.recommendations); // Debugging
            Swal.fire('Success', 'Improvement marked as done and removed.', 'success');
        },
        (error) => {
            console.error("Error deleting recommendation:", error); // Debugging
            Swal.fire('Error', 'Failed to remove the recommendation.', 'error');
        }
    );
}

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(false);
  }
}