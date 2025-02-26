import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/courses';
import { SupabaseService } from '../../services/supabase.service';
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
  imageUploaded: boolean = false;

  constructor(
    private courseService: CourseService,
    private supabaseService: SupabaseService,
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
        this.cdr.detectChanges(); // Manually trigger change detection
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

  async updateCourse(): Promise<void> {
    try {
      const updatedCourse = await this.courseService.updateCourse(this.courseId, this.course).toPromise();
      this.courseUpdated.emit(updatedCourse);
      this.closeModal();
      Swal.fire({
        title: 'Success!',
        text: 'Course updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error updating course:', error);
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong while updating the course.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const uniqueFileName = `${new Date().getTime()}_${this.sanitizeFileName(file.name)}`;

    try {
      // Upload file to Supabase Storage
      const { path, error } = await this.supabaseService.uploadFile(uniqueFileName, file);

      if (error || !path) {
        throw new Error(error?.message || 'Upload failed, no data returned.');
      }

      console.log('Uploaded file path:', path);

      // Get the public URL
      const publicUrl = await this.supabaseService.getPublicUrl(path);
      if (!publicUrl) {
        throw new Error('Failed to retrieve public URL.');
      }

      // Assign the image URL and update flag
      this.course.image = publicUrl;
      this.imageUploaded = true;
      console.log('Image public URL:', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload image.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  // Helper function to sanitize file names
  sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Disable the button until the image is uploaded
  get isUpdateButtonDisabled(): boolean {
    return !this.imageUploaded;
  }
}
