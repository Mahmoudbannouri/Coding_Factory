import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/User';
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

  students: User[] = [];
  filteredStudents: User[] = [];
  selectedStudentId: string | null = null;
  searchQuery: string = '';
  enrolledStudents: Set<number> = new Set();

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchStudents();
    if (this.selectedCourse) {
      this.fetchEnrolledStudents();
    }
  }

  fetchStudents(): void {
    // Fetch the list of students from the backend
    this.courseService.getAllStudents().subscribe(
      (data) => {
        this.students = data;
        this.filteredStudents = data; // Initialize filteredStudents with all students
        console.log('Fetched students:', this.students); // Log fetched students
      },
      (error) => {
        console.error('Error fetching students:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch students.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  fetchEnrolledStudents(): void {
    // Fetch the list of enrolled students for the selected course
    this.courseService.getEnrolledStudents(this.selectedCourse!.id).subscribe(
      (data) => {
        this.enrolledStudents = new Set(data.map(student => student.id));
        this.filterStudents();
      },
      (error) => {
        console.error('Error fetching enrolled students:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch enrolled students.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  filterStudents(): void {
    this.filteredStudents = this.students.filter(student =>
      !this.enrolledStudents.has(student.id) &&
      student.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onStudentSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStudentId = selectElement.value;
  }

  enrollSelectedStudent(): void {
    if (this.selectedCourse && this.selectedStudentId) {
      this.courseService.enrollStudentInCourse(this.selectedCourse.id, +this.selectedStudentId).subscribe(
        () => {
          this.studentsEnrolled.emit();
          this.closeModal();
          Swal.fire({
            title: 'Success!',
            text: 'Student enrolled successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error) => {
          console.error('Error enrolling student:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to enroll student already exists.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please select a valid course and student.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }
}
