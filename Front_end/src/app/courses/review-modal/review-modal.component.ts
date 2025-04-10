import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../models/courses';
import { ReviewService } from '../../services/review';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
})
export class ReviewModalComponent {
  @Input() showModal: boolean = false;
  @Input() selectedCourse!: Course;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() reviewAdded = new EventEmitter<void>();

  review = {
    studentId: 0,
    rating: 1, // Default rating
    comment: '',
  };

  loading = false; // Add a loading state

  constructor(private reviewService: ReviewService) {}

  closeModal() {
    this.showModal = false;
    this.showModalChange.emit(false);
  }

  // Method to set the rating when a star is clicked
  setRating(rating: number): void {
    this.review.rating = rating;
  }

  submitReview() {
    this.loading = true;

    const reviewData = {
      studentId: this.review.studentId,
      courseId: this.selectedCourse.id,
      rating: this.review.rating,
      comment: this.review.comment,
    };

    this.reviewService.addReview(reviewData).subscribe(
      (response: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Success!',
          text: 'Your review has been submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.reviewAdded.emit();
        this.closeModal();
      },
      (error) => {
        this.loading = false;
        console.error('Error adding review:', error);
        console.error('Raw error response:', error.error); // Log the raw error response
        Swal.fire({
          title: 'Error',
          text: 'There was an error adding your review. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}