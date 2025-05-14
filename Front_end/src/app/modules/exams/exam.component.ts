import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { ExamServiceService } from './service/exam/exam-service.service';
import { User } from '@supabase/supabase-js';
import { Exam } from './model/exam/exam';
import { AddquizModalComponent } from './add-quiz-modal/add-quiz-modal.component';
import { Quiz } from './model/exam/quiz';

@Component({
  selector: 'app-Exam',
  templateUrl: './Exam.component.html',
  styleUrls: ['./Exam.component.scss', './addtional css/advanced-cards.component.scss', './addtional css/crud-modal.component.scss','./addtional css/badges.component.scss']
})
export class ExamComponent implements OnInit {
  categoryColors: { [key: string]: string } = {};
  Exams: Exam[] = [];
  Quiz: Quiz[] = [];
  filteredExams: Exam[] = [];
  selectedExam: Exam | null = null;
  selectedQuiz: Quiz | null = null;
  trainers: User[] = [];
  showModal = false;
  showEditModal = false;
  showEditQuizModal = false;
  showAddQuizModal = false;
  searchQuery = '';
  selectedCategory = '';

  constructor(private ExamService: ExamServiceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllExams();
  }

  // Function to generate random colors
  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Function to assign random colors to each category in CategoryEnum


  getAllExams(): void {
    this.ExamService.getAllExams().subscribe(
      (data) => {
        console.log('Exams:', data);
        this.Exams = data.map(Exam => ({
          ...Exam,
         }));
        this.filterExams();
        this.cdr.detectChanges(); // Ensure view updates
      },
      (error) => {
        console.error('Error fetching Exams:', error);
      }
    );
}




  
  
  
  
  filterExams(): void {
    console.log('Filtering with searchQuery:', this.searchQuery);
    console.log('Filtering with selectedCategory:', this.selectedCategory);
  
    this.filteredExams = this.Exams.filter(Exam =>
      (this.searchQuery === '' || Exam.title.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedCategory === '' || Exam.title.toLowerCase() === this.selectedCategory.toLowerCase())
    );
    
    console.log('Filtered Exams:', this.filteredExams); // Log filtered Exams
    
    this.cdr.detectChanges(); // Ensure UI updates
  }

  AddQuiz(examId: number): void {
    this.selectedExam = this.Exams.find(exam => exam.id === examId) || null;
    console.log('Selected Exam:', this.selectedExam); // Debugging
   
    this.showEditQuizModal = true;
    this.cdr.detectChanges();
  }

  openAddExamModal(): void {
    this.showModal = true;
    this.cdr.detectChanges();
  }
  openAddQuizModal(): void {
    this.showAddQuizModal = true;
    this.cdr.detectChanges();
  }

  onExamAdded(Exam: Exam): void {
    this.Exams.push(Exam);
    this.filterExams();
    this.cdr.detectChanges();
  }

  validateRate(rate: number): number {
    return Math.max(0, Math.min(5, rate));
  }

  deleteExam(ExamId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Exam!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ExamService.deleteExam(ExamId).subscribe(() => {
          this.getAllExams();
          Swal.fire('Deleted!', 'The Exam has been deleted.', 'success');
        }, (error) => {
          console.error('Error deleting Exam:', error);
          Swal.fire('Error!', 'There was an error deleting the Exam.', 'error');
        });
      }
    });
  }

  closeAllModals(): void {
    this.showModal = false;
    this.showEditModal = false;
    this.showEditQuizModal = false;
    this.cdr.detectChanges();
  }

  openEditModal(Exam: Exam): void {
    this.selectedExam = Exam;
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  onExamUpdated(updatedExam: Exam): void {
    const index = this.Exams.findIndex(Exam => Exam.id === updatedExam.id);
    if (index !== -1) {
      this.Exams[index] = updatedExam;
      this.filterExams();
      this.cdr.detectChanges();
    }
  }

  openAddQuiz(exam: Exam): void {
    this.selectedExam = exam;
    this.showEditQuizModal = true;
    this.cdr.detectChanges();
  }
}
