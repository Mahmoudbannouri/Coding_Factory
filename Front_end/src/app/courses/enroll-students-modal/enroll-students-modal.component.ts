import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Course } from '../../models/courses';
import { CourseService } from '../../services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enroll-students-modal',
  templateUrl: './enroll-students-modal.component.html',
  styleUrls: ['./enroll-students-modal.component.scss']
})
export class EnrollStudentsModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() selectedCourse: Course | null = null;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() studentsEnrolled = new EventEmitter<void>();

  students: any[] = [];
  filteredStudents: any[] = [];
  selectedStudent: any = null;
  enrolledStudents: Set<number> = new Set();

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchStudents();
    if (this.selectedCourse) {
      this.fetchEnrolledStudents();
    }
  }

  fetchStudents(): void {
    this.courseService.getAllStudentsWithDetails().subscribe(
      (students) => {
        this.students = students;
        this.filterStudents();
      },
      (error) => {
        console.error('Error fetching students:', error);
        Swal.fire('Error', 'Failed to fetch students', 'error');
      }
    );
  }
  
  fetchEnrolledStudents(): void {
    if (!this.selectedCourse) return;
    
    this.courseService.getEnrolledStudentsWithDetails(this.selectedCourse.id).subscribe(
      (students) => {
        this.enrolledStudents = new Set(students.map(s => s.id));
        this.filterStudents();
      },
      (error) => {
        console.error('Error fetching enrolled students:', error);
        Swal.fire('Error', 'Failed to fetch enrolled students', 'error');
      }
    );
  }
  
  filterStudents(): void {
    this.filteredStudents = this.students.filter(student =>
      !this.enrolledStudents.has(student.id)
    );
    
    if (this.selectedStudent && !this.filteredStudents.some(s => s.id === this.selectedStudent?.id)) {
      this.selectedStudent = null;
    }
  }

  enrollSelectedStudent(): void {
    if (this.selectedCourse && this.selectedStudent) {
      this.courseService.enrollStudentInCourse(
        this.selectedCourse.id, 
        this.selectedStudent.id
      ).subscribe({
        next: () => {
          this.enrolledStudents.add(this.selectedStudent.id);
          this.filterStudents();
          this.studentsEnrolled.emit();
          
          Swal.fire({
            title: 'Success',
            text: 'Student enrolled successfully',
            icon: 'success'
          }).then(() => {
            this.closeModal(); // Close modal after Swal is closed
          });
        },
        error: (error) => {
          console.error('Error enrolling student:', error);
          let errorMsg = 'Failed to enroll student';
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.status === 500) {
            errorMsg = 'Server error occurred during enrollment';
          }
          Swal.fire('Error', errorMsg, 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Please select a valid course and student', 'error');
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }
}