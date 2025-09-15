import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../models/courses';
import { ReviewService } from '../../services/review';
import Swal from 'sweetalert2';
import { StorageService } from 'app/shared/auth/storage.service';

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
  hasReviewed = false; // Add this flag

  loading = false;
  hoverRating = 0;

  constructor(private reviewService: ReviewService, private cdr: ChangeDetectorRef) {}
// In review-modal.component.ts
ngOnInit(): void {
  this.review.studentId = StorageService.getUserId();
  this.checkIfReviewed();

}
  closeModal() {
    this.showModal = false;
    this.showModalChange.emit(false);
  }
  checkIfReviewed(): void {
    if (this.selectedCourse && this.review.studentId) {
      this.reviewService.hasStudentReviewed(this.review.studentId, this.selectedCourse.id)
        .subscribe(hasReviewed => {
          this.hasReviewed = hasReviewed;
          this.cdr.detectChanges();
        });
    }
  }
  // Method to set the rating when a star is clicked
  setRating(rating: number): void {
    this.review.rating = rating;
  }

  // In review-modal.component.ts
submitReview() {
  if (this.hasReviewed) {
    Swal.fire('Error', 'You have already reviewed this course', 'error');
    return;
  }

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
      this.hasReviewed = true; // Mark as reviewed
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
      Swal.fire({
        title: 'Error',
        text: error.error?.message || 'There was an error adding your review',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  );
}

getFile(fileName: string): string {
  if (fileName.startsWith('https://')) {
    return fileName;
  }
  return `https://wbptqnvcpiorvwjotqwx.supabase.co/storage/v1/object/public/course-images/${fileName}`;
}

getCategoryDisplayName(category: string): string {
  if (!category) return '';
  return category.toLowerCase().split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

getRatingDescription(rating: number): string {
  switch (rating) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very Good';
    case 5: return 'Excellent';
    default: return '';
  }
}
}