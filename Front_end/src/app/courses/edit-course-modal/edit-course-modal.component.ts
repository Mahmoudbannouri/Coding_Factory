import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/courses';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.scss']
})
export class EditCourseModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() courseId!: number;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() courseUpdated = new EventEmitter<Course>();

  categoryEnum = ["WEB_DEVELOPMENT", "DATA_SCIENCE", "SECURITY", "AI", "CLOUD"];
  course: Course = new Course();
  imageUploading: boolean = false;
  imageUploaded: boolean = false;

  // Error messages for validation
  titleError: string | null = null;
  descriptionError: string | null = null;
  categoryError: string | null = null;
  levelError: string | null = null;
  imageError: string | null = null;

  constructor(
    private courseService: CourseService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.courseId) {
      this.loadCourseData();
    }
  }

  ngOnChanges(): void {
    if (this.courseId) {
      this.loadCourseData();
    }
  }

  loadCourseData(): void {
    this.courseService.getCourseById(this.courseId).subscribe(
      (data) => {
        this.course = data;
        this.imageUploaded = !!this.course.image;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching course:', error);
      }
    );
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  validateForm(): boolean {
    let isValid = true;

    // Validate Title
    if (!this.course.title) {
      this.titleError = 'Title is required.';
      isValid = false;
    } else if (this.course.title.length > 20) {
      this.titleError = 'Title must be less than 20 characters.';
      isValid = false;
    } else {
      this.titleError = null;
    }

    // Validate Description
    if (!this.course.description) {
      this.descriptionError = 'Description is required.';
      isValid = false;
    } else if (this.course.description.length > 100) {
      this.descriptionError = 'Description must be less than 100 characters.';
      isValid = false;
    } else {
      this.descriptionError = null;
    }

    // Validate Category
    if (!this.course.categoryCourse) {
      this.categoryError = 'Category is required.';
      isValid = false;
    } else {
      this.categoryError = null;
    }

    // Validate Level
    if (!this.course.level) {
      this.levelError = 'Level is required.';
      isValid = false;
    } else {
      this.levelError = null;
    }

    return isValid;
  }

  updateCourse(): void {
    if (!this.validateForm()) {
      return;
    }

    this.courseService.updateCourse(this.courseId, this.course).subscribe(
      (updatedCourse) => {
        this.courseUpdated.emit(updatedCourse);
        this.closeModal();
        Swal.fire({
          title: 'Success!',
          text: 'Course updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        console.error('Error updating course:', error);
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
            text: 'Something went wrong while updating the course.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    );
  }

  async onImageSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.imageUploading = true;
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const fileUrl = await this.http.post(
        'http://localhost:8090/courses/upload',
        formData,
        { responseType: 'text' }
      ).toPromise();

      if (fileUrl) {
        this.course.image = fileUrl;
        this.imageUploaded = true;
        this.imageError = null;
        Swal.fire('Success!', 'Image uploaded successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMsg = error.error?.message || error.message || 'Failed to upload image';
      this.imageError = errorMsg;
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      this.imageUploading = false;
      this.cdr.detectChanges();
    }
  }
}