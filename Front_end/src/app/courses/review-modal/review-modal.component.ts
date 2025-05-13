// review-modal.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ReviewService } from '../../services/review';
import { StorageService } from 'app/shared/auth/storage.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss']
})
export class ReviewModalComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedCourse: any;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() reviewAdded = new EventEmitter<void>();

  review = {
    studentId: 0,
    rating: 1,
    comment: ''
  };
  hasReviewed = false;
  loading = false;
  checkingReview = false;

  constructor(
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.showModal) {
      this.resetForm();
      this.review.studentId = StorageService.getUserId();
      this.checkIfReviewed();
    }
  }

  resetForm(): void {
    this.review = {
      studentId: 0,
      rating: 1,
      comment: ''
    };
    this.hasReviewed = false;
    this.loading = false;
    this.checkingReview = false;
  }

  checkIfReviewed(): void {
    if (!this.selectedCourse || !this.review.studentId) return;

    this.checkingReview = true;
    this.reviewService.hasStudentReviewed(this.review.studentId, this.selectedCourse.id)
      .subscribe({
        next: (hasReviewed) => {
          this.hasReviewed = hasReviewed;
          this.checkingReview = false;
          this.cdr.detectChanges();

          if (hasReviewed) {
            Swal.fire('Info', 'You have already reviewed this course.', 'info');
            this.closeModal();
          }
        },
        error: (err) => {
          console.error('Error checking review:', err);
          this.hasReviewed = false;
          this.checkingReview = false;
          this.cdr.detectChanges();
        }
      });
  }

  setRating(rating: number): void {
    if (!this.hasReviewed) {
      this.review.rating = rating;
    }
  }

  submitReview(): void {
    if (this.hasReviewed || !this.selectedCourse) {
      return;
    }

    this.loading = true;

    const reviewData = {
      studentId: this.review.studentId,
      courseId: this.selectedCourse.id,
      rating: this.review.rating,
      comment: this.review.comment
    };

    this.reviewService.addReview(reviewData).subscribe({
      next: () => {
        this.hasReviewed = true;
        this.loading = false;
        Swal.fire('Success', 'Review submitted successfully!', 'success');
        this.reviewAdded.emit();
        this.closeModal();
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 409) {
          this.hasReviewed = true;
          Swal.fire('Info', 'You have already reviewed this course.', 'info');
          this.closeModal();
        } else {
          const errorMessage = error.error?.message || 'Failed to submit review';
          Swal.fire('Error', errorMessage, 'error');
        }
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(false);
  }
}
