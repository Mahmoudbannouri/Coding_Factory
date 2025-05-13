import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseResourceService } from '../../services/course-resource.service';
import { CourseResource } from '../../models/CourseResource';
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

  constructor(private courseResourceService: CourseResourceService) {}

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
    this.resetForm();
  }

  resetForm(): void {
    this.newResource = new CourseResource();
    this.documentUploaded = false;
    this.videoUploaded = false;
    this.titleError = false;
    this.descriptionError = false;
    this.resourceTypeError = false;
  }

  async addResourceToCourse(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    const resourceToAdd: CourseResource = {
      ...this.newResource,
      uploadDate: new Date(),
      course: { id: this.selectedCourse?.id } as Course
    };

    try {
      const response = await this.courseResourceService.addResource(resourceToAdd).toPromise();
      if (this.selectedCourse?.resources) {
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
    } catch (error: any) {
      console.error('Error adding resource:', error);
      const errorMsg = error.error?.message || 'Something went wrong while adding the resource';
      Swal.fire({
        title: 'Error',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  validateForm(): boolean {
    let isValid = true;

    // Validate Title
    if (!this.newResource.title) {
      this.titleError = true;
      isValid = false;
    } else {
      this.titleError = this.newResource.title.length > 20;
      isValid = !this.titleError;
    }

    // Validate Description
    if (!this.newResource.description) {
      this.descriptionError = true;
      isValid = false;
    } else {
      this.descriptionError = this.newResource.description.length > 100;
      isValid = isValid && !this.descriptionError;
    }

    // Validate Resource Type
    if (!this.newResource.resourceType) {
      this.resourceTypeError = true;
      isValid = false;
    } else {
      this.resourceTypeError = this.newResource.resourceType.length > 20;
      isValid = isValid && !this.resourceTypeError;
    }

    // Validate Course Selection
    if (!this.selectedCourse?.id) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a valid course.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }

    return isValid;
  }

  async onDocumentSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.documentUploading = true;
    this.documentUploaded = false;
    
    try {
      const fileUrl = await this.courseResourceService.uploadDocument(file).toPromise();
      if (fileUrl) {
        this.newResource.link_doccument = fileUrl;
        this.documentUploaded = true;
        Swal.fire('Success!', 'Document uploaded successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      const errorMsg = error.error?.message || 'Failed to upload document';
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      this.documentUploading = false;
    }
  }

  async onVideoSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.videoUploading = true;
    this.videoUploaded = false;
    
    try {
      const fileUrl = await this.courseResourceService.uploadVideo(file).toPromise();
      if (fileUrl) {
        this.newResource.link_video = fileUrl;
        this.videoUploaded = true;
        Swal.fire('Success!', 'Video uploaded successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Error uploading video:', error);
      const errorMsg = error.error?.message || 'Failed to upload video';
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      this.videoUploading = false;
    }
  }

  get isAddButtonDisabled(): boolean {
    return this.titleError || this.descriptionError || this.resourceTypeError || 
           !this.newResource.title || !this.newResource.description || 
           !this.newResource.resourceType || !this.documentUploaded || !this.videoUploaded;
  }
}