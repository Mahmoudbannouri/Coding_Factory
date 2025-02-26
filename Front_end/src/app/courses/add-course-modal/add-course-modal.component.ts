import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/courses';
import { SupabaseService } from '../../services/supabase.service';
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
  imageUploading: boolean = false; // Flag to handle the image upload process

  constructor(private courseService: CourseService, private supabaseService: SupabaseService) {}

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  // Handle image selection and upload
 // Handle image selection and upload
async onImageSelected(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      console.log('Selected file:', file);

      // Check if the file already exists in Supabase storage
      let fileName = file.name;
      const fileExists = await this.supabaseService.fileExists(fileName); 

      // If file exists, generate a new name with versioning
      let version = 1;
      while (fileExists) {
        version++;
        const fileExtension = fileName.split('.').pop();
        fileName = fileName.replace(`.${fileExtension}`, `-v${version}.${fileExtension}`);
        const fileExists = await this.supabaseService.fileExists(fileName); // Check again with the new name
      }

      // Upload the file with the new or original name
      const uploadData = await this.uploadFileToSupabase(file, fileName); // Pass the new name if needed
      if (uploadData && uploadData.publicUrl) {
        this.newCourse.image = uploadData.publicUrl; // Set the new image URL
        Swal.fire({
          title: 'Success!',
          text: 'File uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error uploading the image. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

    } catch (error) {
      console.error('Error handling image:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while handling the image.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}

  

  
  
  

  // Upload image to Supabase and get the URL/path
// Upload image to Supabase and get the URL/path
async uploadFileToSupabase(file: File, fileName: string) {
  this.imageUploading = true; // Set flag to indicate upload in progress
  try {
    // Upload the file to Supabase with the new name
    const data = await this.supabaseService.uploadFile(fileName, file);

    if (data && data.path) {
      // Once uploaded, get the public URL
      const publicUrl = await this.supabaseService.getPublicUrl(data.path);
      return { publicUrl };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  } finally {
    this.imageUploading = false; // Reset flag after upload attempt
  }
}


  // Add course after image upload is successful
  addCourse(): void {
    if (!this.newCourse.image) {
      // Ensure image is set before submitting
      Swal.fire({
        title: 'Error',
        text: 'Image is required!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
