import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/courses';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.component.scss']
})
export class AddCourseModalComponent {
  @Input() showModal: boolean = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() courseAdded = new EventEmitter<Course>();
  categoryEnum = ["WEB_DEVELOPMENT", "DATA_SCIENCE", "SECURITY", "AI", "CLOUD"];

  newCourse: Course = new Course();
  imageUploading: boolean = false;

  // Error messages for validation
  titleError: string | null = null;
  descriptionError: string | null = null;
  categoryError: string | null = null;
  levelError: string | null = null;
  imageError: string | null = null;

  constructor(
    private courseService: CourseService,
    private http: HttpClient
  ) {}

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
    this.resetForm();
  }

  resetForm(): void {
    this.newCourse = new Course();
    this.titleError = null;
    this.descriptionError = null;
    this.categoryError = null;
    this.levelError = null;
    this.imageError = null;
  }

  validateForm(): boolean {
    let isValid = true;

    // Validate Title
    if (!this.newCourse.title) {
      this.titleError = 'Title is required.';
      isValid = false;
    } else if (this.newCourse.title.length > 20) {
      this.titleError = 'Title must be less than 20 characters.';
      isValid = false;
    } else {
      this.titleError = null;
    }

    // Validate Description
    if (!this.newCourse.description) {
      this.descriptionError = 'Description is required.';
      isValid = false;
    } else if (this.newCourse.description.length > 100) {
      this.descriptionError = 'Description must be less than 100 characters.';
      isValid = false;
    } else {
      this.descriptionError = null;
    }

    // Validate Category
    if (!this.newCourse.categoryCourse) {
      this.categoryError = 'Category is required.';
      isValid = false;
    } else {
      this.categoryError = null;
    }

    // Validate Level
    if (!this.newCourse.level) {
      this.levelError = 'Level is required.';
      isValid = false;
    } else {
      this.levelError = null;
    }

    // Validate Image
    if (!this.newCourse.image) {
      this.imageError = 'Image is required.';
      isValid = false;
    } else {
      this.imageError = null;
    }

    return isValid;
  }

  isFormValid(): boolean {
    return (
      !!this.newCourse.title &&
      this.newCourse.title.length <= 20 &&
      !!this.newCourse.description &&
      this.newCourse.description.length <= 100 &&
      !!this.newCourse.categoryCourse &&
      !!this.newCourse.level &&
      !!this.newCourse.image
    );
  }

  async onImageSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.imageUploading = true;
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add responseType: 'text' since we're expecting a plain string URL
      const fileUrl = await this.http.post(
        'http://localhost:8090/courses/upload',
        formData,
        { responseType: 'text' }  // Important change here
      ).toPromise();

      if (fileUrl) {
        this.newCourse.image = fileUrl;
        this.imageError = null;
        Swal.fire('Success!', 'File uploaded successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      const errorMsg = error.error?.message || error.message || 'Failed to upload image';
      this.imageError = errorMsg;
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      this.imageUploading = false;
    }
}

  addCourse(): void {
    if (!this.validateForm()) {
      return;
    }

    this.courseService.addCourse(this.newCourse).subscribe(
      (course) => {
        this.courseAdded.emit(course);
        this.closeModal();
        Swal.fire({
          title: 'Success!',
          text: 'Course added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        console.error('Error adding course:', error);
        if (error.error) {
          const errorMessages = Object.values(error.error).join('\n');
          Swal.fire({
            title: 'Validation Error',
            text: errorMessages,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong while adding the course.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    );
  }
}