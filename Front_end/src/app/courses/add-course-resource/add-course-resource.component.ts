import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseResourceService } from '../../services/course-resource.service';
import { CourseResource } from '../../models/CourseResource';
import { SupabaseService } from '../../services/supabase.service';
import { Course } from '../../models/courses';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-course-resource',
  templateUrl: './add-course-resource.component.html',
  styleUrls: [
    './add-course-resource.component.scss',
    '../course.component.scss',
  ]
})
export class AddCourseResourceComponent {
  @Input() showModal: boolean = false;
  @Input() selectedCourse: Course | null = null;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() resourceAdded = new EventEmitter<CourseResource>();

  newResource: CourseResource = new CourseResource();

  documentUploaded: boolean = false;
  videoUploaded: boolean = false;
  documentUploading: boolean = false;
  videoUploading: boolean = false;

  titleError: boolean = false;
  descriptionError: boolean = false;
  resourceTypeError: boolean = false;

  constructor(private courseResourceService: CourseResourceService, private supabaseService: SupabaseService) {}

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  async addResourceToCourse(): Promise<void> {
    this.titleError = this.newResource.title?.length > 20 || !this.newResource.title;
    this.descriptionError = this.newResource.description?.length > 100 || !this.newResource.description;
    this.resourceTypeError = this.newResource.resourceType?.length > 20 || !this.newResource.resourceType;

    if (this.titleError || this.descriptionError || this.resourceTypeError) {
      return;
    }

    const newResource = new CourseResource();
    newResource.title = this.newResource.title;
    newResource.resourceType = this.newResource.resourceType;
    newResource.description = this.newResource.description;
    newResource.uploadDate = new Date(); // Ensure date is in ISO format

    // Ensure correct links are assigned based on resource type
    if (this.newResource.link_doccument) {
      newResource.link_doccument = this.newResource.link_doccument;
    }
    if (this.newResource.link_video) {
      newResource.link_video = this.newResource.link_video;
    }

    // Ensure course is selected
    if (!this.selectedCourse || !this.selectedCourse.id) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a valid course.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Create a minimal course object with only the id property
    newResource.course = { id: this.selectedCourse.id } as Course;

    // Log the resource data before sending
    console.log('Request Data:', newResource);

    try {
      const response = await this.courseResourceService.addResource(newResource).toPromise();
      if (this.selectedCourse.resources) {
        this.selectedCourse.resources.push(response);
      }
      this.closeModal();
      this.resourceAdded.emit(response);
      Swal.fire({
        title: 'Success!',
        text: 'Resource added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error adding resource:', error);
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong while adding the resource.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  async onDocumentSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const uniqueFileName = `${new Date().getTime()}_${this.sanitizeFileName(file.name)}`;
    this.documentUploading = true;

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

      // ✅ Assign the document URL and update flag
      this.newResource.link_doccument = publicUrl;
      this.documentUploaded = true;
      console.log('Document public URL:', publicUrl);
    } catch (error) {
      console.error('Error uploading document:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload document.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      this.documentUploading = false;
    }
  }

  async onVideoSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const uniqueFileName = `${new Date().getTime()}_${this.sanitizeFileName(file.name)}`;
      this.videoUploading = true;

      try {
        // Upload the video
        const response = await this.supabaseService.uploadFile(uniqueFileName, file);

        if (response.error) {
          throw new Error(response.error);
        }

        // Log the uploaded file data
        console.log('Video upload response:', response);

        // Check if the file path is available
        if (response.path) {
          const publicUrl = await this.supabaseService.getPublicUrl(response.path);
          if (publicUrl) {
            this.newResource.link_video = publicUrl;
            this.videoUploaded = true;
            console.log('Video public URL:', publicUrl);
          } else {
            throw new Error('Failed to retrieve public URL for the video');
          }
        } else {
          throw new Error('No file path returned for the video upload');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error uploading video.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        this.videoUploading = false;
      }
    }
  }

  // Helper function to sanitize file names
  sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Disable the button until both document and video are uploaded
  get isAddButtonDisabled(): boolean {
    return !(this.documentUploaded && this.videoUploaded);
  }
}
