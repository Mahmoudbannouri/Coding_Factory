import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Course } from '../../models/courses';
import { CourseService } from '../../services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enroll-students-modal',
  templateUrl: './enroll-students-modal.component.html',
  styleUrls: ['./enroll-students-modal.component.scss']
})
export class EnrollStudentsModalComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedCourse: Course | null = null;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() studentsEnrolled = new EventEmitter<void>();

  students: any[] = [];
  filteredStudents: any[] = [];
  selectedStudent: any = null;
  enrolledStudents: Set<number> = new Set();
  loading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCourse'] && this.selectedCourse) {
      this.fetchEnrolledStudents();
    }
  }

  fetchStudents(): void {
    this.loading = true;
    this.courseService.getAllStudentsWithDetails().subscribe({
      next: (students) => {
        this.students = students;
        this.filterStudents();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        Swal.fire('Error', 'Failed to fetch students', 'error');
        this.loading = false;
      }
    });
  }

  fetchEnrolledStudents(): void {
    if (!this.selectedCourse) return;

    this.loading = true;
    this.courseService.getEnrolledStudents(this.selectedCourse.id).subscribe({
      next: (students) => {
        this.enrolledStudents = new Set(students);
        this.filterStudents();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching enrolled students:', error);
        Swal.fire('Error', 'Failed to fetch enrolled students', 'error');
        this.loading = false;
      }
    });
  }

  filterStudents(): void {
    this.filteredStudents = this.students.filter(student =>
      !this.enrolledStudents.has(student.id)
    );
  }

  enrollSelectedStudent(): void {
    if (!this.selectedCourse || !this.selectedStudent) {
      Swal.fire('Error', 'Please select a course and student', 'error');
      return;
    }

    this.loading = true;
    this.courseService.enrollStudentInCourse(
      this.selectedCourse.id,
      this.selectedStudent.id
    ).subscribe({
      next: () => {
        this.enrolledStudents.add(this.selectedStudent.id);
        this.filterStudents();
        this.studentsEnrolled.emit();
        this.loading = false;

        Swal.fire({
          title: 'Success',
          text: 'Student enrolled successfully',
          icon: 'success'
        });
      },
      error: (error) => {
        console.error('Error enrolling student:', error);
        this.loading = false;
        let errorMsg = error.error?.message || 'Failed to enroll student';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }
}
