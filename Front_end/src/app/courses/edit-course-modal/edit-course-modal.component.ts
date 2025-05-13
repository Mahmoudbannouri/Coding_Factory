import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { CourseService } from '../../services/course.service';
import { Course } from '../../models/courses';
import { CategoryEnum } from '../../models/CategoryEnum';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.scss']
})
export class EditCourseModalComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() courseId!: number;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() courseUpdated = new EventEmitter<Course>();

  categoryEnum = CategoryEnum;
  course: Partial<Course> = {};
  imageUploading: boolean = false;
  imageUploaded: boolean = false;
  isUpdating: boolean = false;

  errors: { [key: string]: string | null } = {
    title: null,
    description: null,
    category: null,
    level: null,
    image: null
  };

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] || changes['showModal']) {
      if (this.courseId && this.showModal) {
        this.loadCourseData();
      }
    }
  }

  loadCourseData(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (response: any) => {
        const apiCourse = response.course || response;
        this.course = {
          ...apiCourse,
          resources: apiCourse.resources || []
        };
        this.imageUploaded = !!this.course.image;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading course:', error);
        Swal.fire('Error', 'Failed to load course data', 'error');
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(false);
  }

  validateForm(): boolean {
    this.errors = {
      title: !this.course.title
        ? 'Title is required'
        : this.course.title.length > 100
          ? 'Title must be ≤100 characters'
          : null,
      description: !this.course.description
        ? 'Description is required'
        : this.course.description.length > 500
          ? 'Description must be ≤500 characters'
          : null,
      category: !this.course.categoryCourse ? 'Category is required' : null,
      level: !this.course.level
        ? 'Level is required'
        : this.course.level.length > 20
          ? 'Level must be ≤20 characters'
          : null,
      image: !this.course.image ? 'Image is required' : null
    };

    return !Object.values(this.errors).some((error) => error !== null);
  }

  async updateCourse(): Promise<void> {
    if (!this.validateForm()) return;

    this.isUpdating = true;
    try {
      const courseToUpdate = this.prepareCourseForUpdate();

      const updatedCourse = await this.courseService
        .updateCourse(this.courseId, courseToUpdate)
        .toPromise();

      // Optimistically show success
      this.courseUpdated.emit(updatedCourse);
      Swal.fire('Success', 'Course updated successfully!', 'success');
      this.closeModal();

      try {
        const qrResponse = await this.courseService
          .getCourseQRCodeBase64(this.courseId)
          .toPromise();

        updatedCourse.qrCodeUrl = qrResponse.qrCodeBase64;

        await this.courseService
          .updateCourse(this.courseId, updatedCourse)
          .toPromise();
      } catch (qrErr) {
        console.warn('QR code generation failed:', qrErr);
        // Optional: Show info alert
        // Swal.fire('Notice', 'Course updated, but QR code could not be generated.', 'info');
      }

    } catch (error: any) {
      console.error('Update error:', error);
      const errorMsg = error.error?.message || 'Failed to update course';
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      this.isUpdating = false;
    }
  }

  private prepareCourseForUpdate(): Course {
    return {
      id: this.course.id!,
      title: this.course.title!,
      description: this.course.description!,
      level: this.course.level!,
      rate: this.course.rate || 0,
      image: this.course.image!,
      categoryCourse:
        typeof this.course.categoryCourse === 'string'
          ? CategoryEnum[
            this.course.categoryCourse as keyof typeof CategoryEnum
            ]
          : this.course.categoryCourse!,
      trainerId: this.course.trainerId!,
      resources: this.course.resources || [],
      qrCodeUrl: this.course.qrCodeUrl || '',
      hasReviewed: this.course.hasReviewed || false
    };
  }

  async onImageSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.imageUploading = true;
    try {
      const formData = new FormData();
      formData.append('file', file);

      const fileUrl = await this.http
        .post('http://localhost:8090/courses/upload', formData, {
          responseType: 'text'
        })
        .toPromise();

      if (fileUrl) {
        this.course.image = fileUrl;
        this.imageUploaded = true;
        this.errors.image = null;
      }
    } catch (error: any) {
      this.errors.image = error.error?.message || 'Failed to upload image';
    } finally {
      this.imageUploading = false;
      this.cdr.detectChanges();
    }
  }

  get categories() {
    return Object.keys(CategoryEnum)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        value: CategoryEnum[key as keyof typeof CategoryEnum],
        display: this.getCategoryDisplayName(key)
      }));
  }

  getCategoryDisplayName(category: string): string {
    return category
      .split('_')
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }
}
