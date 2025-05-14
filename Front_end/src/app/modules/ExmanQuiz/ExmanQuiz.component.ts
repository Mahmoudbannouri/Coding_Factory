import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../exams/service/quiz/quiz.service';
import { Quiz } from '../exams/model/exam/quiz';
import { ExamServiceService } from '../exams/service/exam/exam-service.service';
import Swal from 'sweetalert2';
import { CertificatService } from '../exams/service/certificat/certificat.service';

@Component({
  selector: 'app-ExmanQuiz',
  templateUrl: './ExmanQuiz.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./ExmanQuiz.component.scss'],
  providers: [QuizService]
})
export class ExmanQuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  currentQuizIndex = 0;
  examId: number = 1;
  timeLimit: number = 30;
  userId: number = 1; // Replace with the actual user ID (e.g., from authentication)
  username: string = 'Lina DH'; // Replace with the actual username (e.g., from authentication)
  ExamTitle: string = 'Java Programming Exam';

  loading: boolean = true;
  error: string | null = null;
  selectedOptions: { [key: number]: string } = {}; // Stores selected options for each quiz

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,

    private examServiceService: ExamServiceService,
    private certificatService : CertificatService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.examId = +params['examId'] || 1;
      this.loadQuizzes();
    });
  }

  async loadQuizzes(): Promise<void> {
    try {
      this.loading = true;
      this.quizzes = await this.quizService.getQuizzesByExamId(this.examId);
      this.quizzes = this.quizzes.filter(quiz => quiz.question !== null); // Filter out null questions
      this.loading = false;
      this.cdr.markForCheck();
    } catch (error) {
      this.error = 'Failed to load quizzes';
      this.loading = false;
      console.error('Error loading quizzes:', error);
      this.cdr.markForCheck();
    }
  }

  get currentQuiz(): Quiz | null {
    return this.quizzes.length > 0 ? this.quizzes[this.currentQuizIndex] : null;
  }

  get selectedOption(): string | null {
    if (!this.currentQuiz) return null;
    return this.selectedOptions[this.currentQuiz.id] || null;
  }

  nextQuestion(): void {
    if (this.currentQuizIndex < this.quizzes.length - 1) {
      this.currentQuizIndex++;
      this.cdr.markForCheck();
    }
  }

  previousQuestion(): void {
    if (this.currentQuizIndex > 0) {
      this.currentQuizIndex--;
      this.cdr.markForCheck();
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.quizzes.length) {
      this.currentQuizIndex = index;
      this.cdr.markForCheck();
    }
  }

  chooseOption(option: string): void {
    if (!this.currentQuiz) return;
    this.selectedOptions[this.currentQuiz.id] = option; // Store the selected option
    this.cdr.markForCheck();
  }

  isQuestionAnswered(index: number): boolean {
    const quiz = this.quizzes[index];
    return quiz && this.selectedOptions[quiz.id] !== undefined;
  }

  getAnsweredQuestionsCount(): number {
    return Object.keys(this.selectedOptions).length;
  }

  submitQuiz(): void {
    // Convert selected options to a list of selected answer strings
    const selectedAnswers = this.quizzes
      .filter(quiz => this.selectedOptions[quiz.id] !== undefined)
      .map(quiz => this.selectedOptions[quiz.id]); // Get the selected option string

    // Call the completeExam method from the service
    this.examServiceService.completeExam(this.examId, this.userId, selectedAnswers, this.username, this.ExamTitle)
      .subscribe({
        next: (response) => {
          console.log('Exam completed successfully:', response);
          Swal.fire('Success!', 'Exam completed successfully!', 'success');
          this.certificatService.downloadCertificate(this.userId, this.examId,);
        },
        error: (error) => {
          console.error('Error completing the exam:', error);
          Swal.fire('Error!', 'Error completing the exam: ' + error.message, 'error');
        }
      });
  }
}