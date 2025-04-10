import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseService } from '../../services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-students-modal',
  templateUrl: './show-students-modal.component.html',
  styleUrls: ['./show-students-modal.component.scss']
})
export class ShowStudentsModalComponent {
  @Input() showModal: boolean = false;
  @Input() students: any[] = [];
  @Input() courseId: number; // Make sure this is properly set
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() studentRemoved = new EventEmitter<void>();

  constructor(private courseService: CourseService) {}

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  unenrollStudent(studentId: number): void {
    if (!this.courseId) {
      console.error('Course ID is undefined');
      return;
    }
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this student from the course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.unenrollStudent(this.courseId, studentId).subscribe({
          next: () => {
            // Remove student from local list
            this.students = this.students.filter(s => s.id !== studentId);
            this.studentRemoved.emit();
            Swal.fire('Success', 'Student removed successfully', 'success');
          },
          error: (err) => {
            console.error('Error unenrolling student:', err);
            Swal.fire('Error', 'Failed to remove student', 'error');
          }
        });
      }
    });
  }
}