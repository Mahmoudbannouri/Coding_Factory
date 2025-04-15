import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Exam } from '../model/exam/exam';
import { ExamServiceService } from '../service/exam/exam-service.service';

@Component({
  selector: 'app-edit-exam-modal',
  templateUrl: './edit-exam-modal.component.html',
  styleUrls: ['./edit-exam-modal.component.scss', '../exam.component.scss', '../addtional css/advanced-cards.component.scss', '../addtional css/crud-modal.component.scss']
})
export class EditexamModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() examId!: number;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() examUpdated = new EventEmitter<Exam>();

  categoryEnum = ["WEB_DEVELOPMENT", "DATA_SCIENCE", "SECURITY", "AI", "CLOUD"];
  exam: Exam = new Exam();

  constructor(private examService: ExamServiceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.examId) {
      this.loadexamData();
    }
  }

  ngOnChanges(): void {
    if (this.examId) {
      this.loadexamData();
    }
  }

  loadexamData(): void {
    this.examService.getExamById(this.examId).subscribe(
      (data) => {
        this.exam = data;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (error) => {
        console.error('Error fetching exam:', error);
      }
    );
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  updateExam(): void {
    console.log("test")
    this.examService.updateExam(this.examId, this.exam).subscribe(
      (updatedexam) => {
        this.examUpdated.emit(updatedexam);
        this.closeModal();
        Swal.fire({
          title: 'Success!',
          text: 'exam updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        console.error('Error updating exam:', error);
      }
    );
  }
}
