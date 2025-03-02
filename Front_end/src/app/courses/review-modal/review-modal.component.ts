import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../models/courses';
import { ReviewService } from '../../services/review';

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
    rating: 1,
    comment: '',
  };

  constructor(private reviewService: ReviewService) {}

  closeModal() {
    this.showModal = false;
    this.showModalChange.emit(false);
  }

  submitReview() {
    const reviewData = {
      studentId: this.review.studentId,
      courseId: this.selectedCourse.id,
      rating: this.review.rating,
      comment: this.review.comment,
    };

    this.reviewService.addReview(reviewData).subscribe(
      () => {
        this.reviewAdded.emit();
        this.closeModal();
      },
      (error) => {
        console.error('Error adding review:', error);
      }
    );
  }
}