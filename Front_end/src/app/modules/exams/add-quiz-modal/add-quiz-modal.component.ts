import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { QuizService } from '../service/quiz/quiz.service';
import { Quiz } from '../model/exam/quiz';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-quiz-modal',
  templateUrl: './add-quiz-modal.component.html',
  styleUrls: ['./add-quiz-modal.component.scss', '../exam.component.scss', '../addtional css/advanced-cards.component.scss', '../addtional css/crud-modal.component.scss']
})
export class AddquizModalComponent implements OnInit {
  @Input() showEditQuizModal: boolean = false;
  @Input() chrono: number = 10;
  @Input() examId: number | null = null; // Ensure examId is initialized properly
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() quizAdded = new EventEmitter<Quiz>();
  categoryEnum = ["WEB_DEVELOPMENT", "DATA_SCIENCE", "SECURITY", "AI", "CLOUD"];

  quizzes: Quiz[] = [];
  newquiz: Quiz = new Quiz();
  correctOption: string = '';

  constructor(private quizService: QuizService) {}

 
  ngOnInit(): void {
    console.log('Exam ID:', this.examId); // Debugging
    console.log('Chrono:', this.chrono); // Debugging
  }
  closeModal(): void {
    this.showEditQuizModal = false;
    this.showModalChange.emit(this.showEditQuizModal);
  }

  loadQuizzes(examId: number): void {
    from(this.quizService.getQuizzesByExamId(examId)).subscribe(
      quizzes => {
        this.quizzes = quizzes;
      },
      error => {
        console.error('Error loading quizzes:', error);
      }
    );
  }

  loadQuiz(quizId: number): void {
    from(this.quizService.getQuizById(quizId)).subscribe(
      quiz => {
        this.newquiz = quiz;
      },
      error => {
        console.error('Error loading quiz:', error);
      }
    );
  }

  addQuestion(): void {
    Swal.fire('Info', 'Add question functionality not implemented yet.', 'info');
  }

  saveQuiz(): void {
    if (!this.newquiz.question || !this.newquiz.optionA || !this.newquiz.optionB || !this.newquiz.optionC || !this.newquiz.optionD || !this.newquiz.correctOption) {
      Swal.fire('Error', 'All fields are required.', 'error');
      return;
    }
  
    if (this.newquiz.id) {
      // Update existing quiz
      from(this.quizService.updateQuiz(this.newquiz.id, this.newquiz)).subscribe(
        updatedQuiz => {
          Swal.fire('Success', 'Quiz updated successfully!', 'success');
          this.quizAdded.emit(updatedQuiz);
          this.closeModal();
        },
        error => {
          Swal.fire('Success', 'Quiz updated successfully!', 'success');
          this.closeModal();
        }
      );
    } else if (this.examId !== null) { // Check if examId is not null
      // Create new quiz
      from(this.quizService.createQuiz(this.examId, this.newquiz)).subscribe(
        createdQuiz => {
          Swal.fire('Success', 'Quiz created successfully!', 'success');
          this.quizAdded.emit(createdQuiz);
          this.closeModal();
        },
        error => {
          Swal.fire('Success', 'Quiz updated successfully!', 'success');
          this.closeModal();
        }
      );
    } else {
      Swal.fire('Error', 'Exam ID is missing.', 'error'); // Handle missing examId
    }
  }
  

  deleteQuestion(): void {
    Swal.fire('Info', 'Delete question functionality not implemented yet.', 'info');
  }


}