import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { User } from '../../models/User';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-show-students-modal',
  templateUrl: './show-students-modal.component.html',
  styleUrls: ['./show-students-modal.component.scss']
})
export class ShowStudentsModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() courseId: number | null = null;
  @Output() showModalChange = new EventEmitter<boolean>();

  @Input() students: User[] = [];
  loading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    if (this.courseId) {
      this.loadStudents();
    }
  }

  loadStudents(): void {
    this.loading = true;
    this.courseService.getEnrolledStudentsWithDetails(this.courseId!).subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }
}
