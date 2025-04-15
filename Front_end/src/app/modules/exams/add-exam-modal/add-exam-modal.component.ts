import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import Swal from 'sweetalert2';
import { ExamServiceService } from '../service/exam/exam-service.service';
import { Exam } from '../model/exam/exam';

@Component({
  selector: 'app-add-exam-modal',
  templateUrl: './add-exam-modal.component.html',
  styleUrls: ['./add-exam-modal.component.scss', '../exam.component.scss', '../addtional css/advanced-cards.component.scss', '../addtional css/crud-modal.component.scss']
})
export class AddexamModalComponent {
  @Input() showModal: boolean = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() examAdded = new EventEmitter<Exam>();

  newexam: Exam = new Exam();
  imageUploading: boolean = false; // Flag to handle the image upload process

  constructor(private examService: ExamServiceService, private supabaseService: SupabaseService) {}

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  // Handle image selection and upload
 // Handle image selection and upload

  

  
  
  

  // Upload image to Supabase and get the URL/path
// Upload image to Supabase and get the URL/path

  addexam(): void {
    if (!this.newexam.title || !this.newexam.description || !this.newexam.questionCount || !this.newexam.chrono) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    console.log(this.newexam);

    this.examService.createExam(this.newexam).subscribe(
      (exam) => {
        this.examAdded.emit(exam);
        Swal.fire({
          title: 'Success!',
          text: 'exam added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.closeModal();

      },
      (error) => {
        console.error('Error adding exam:', error);
        if (error.error) {
          const errorMessages = Object.values(error.error).join('\n');
          Swal.fire({
            title: 'Validation Error',
            text: errorMessages,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.closeModal();

        } else {
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong while adding the exam.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.closeModal();

        }
      }
    );
  }
}
