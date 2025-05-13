import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/courses';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { StorageService } from 'app/shared/auth/storage.service';

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
    private http: HttpClient,
    private storageService: StorageService // Inject StorageService

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

      const token = StorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const fileUrl = await this.http.post(
        'http://localhost:8090/courses/upload',
        formData,
        {
          responseType: 'text',
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type - let browser set it with boundary
          })
        }
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

// Update the addCourse method in AddCourseModalComponent
// Update the addCourse method in AddCourseModalComponent
  addCourse(): void {
    console.log('[Add Course] Starting add course process...');

    if (!this.validateForm()) {
      console.log('[Add Course] Form validation failed');
      return;
    }

    const user = this.storageService.getUser();
    if (!user?.id) {
      console.error('User ID not available');
      Swal.fire('Error', 'User not authenticated', 'error');
      return;
    }

    console.log('Adding course with trainer ID:', user.id);
    this.newCourse.trainerId = user.id;

    this.courseService.addCourse(this.newCourse,user.id).subscribe({
      next: (course) => {
        console.log('[Add Course] Successfully added course:', course);
        this.courseAdded.emit(course);
        this.closeModal();
        Swal.fire('Success!', 'Course added successfully!', 'success');
      },
      error: (error) => {
        console.error('[Add Course] Error:', error);
        Swal.fire('Error', error.error?.message || 'Failed to add course', 'error');
      }
    });
  }
}
