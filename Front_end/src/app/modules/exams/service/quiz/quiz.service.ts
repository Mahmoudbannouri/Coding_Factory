import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../../model/exam/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = `http://localhost:8080/quizzes`;

  constructor(private http: HttpClient) { }

  /**
   * Get all quizzes
   * @returns Observable of Quiz array
   */
  getAllQuizzes(): Promise<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl).toPromise();
  }

  /**
   * Get a quiz by its ID
   * @param id - Quiz ID
   * @returns Observable of Quiz
   */
  getQuizById(id: number): Promise<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`).toPromise();
  }

  /**
   * Create a new quiz for a specific exam
   * @param examId - Exam ID
   * @param quiz - Quiz object
   * @returns Observable of created Quiz
   */
  createQuiz(examId: number, quiz: Quiz): Promise<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/quiz/${examId}`, quiz).toPromise();
  }

  /**
   * Update an existing quiz
   * @param id - Quiz ID
   * @param quiz - Updated Quiz object
   * @returns Observable of updated Quiz
   */
  updateQuiz(id: number, quiz: Quiz): Promise<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, quiz).toPromise();
  }

  /**
   * Delete a quiz
   * @param id - Quiz ID
   * @returns Observable of void
   */
  deleteQuiz(id: number): Promise<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).toPromise();
  }

  /**
   * Get all quizzes for a specific exam
   * @param examId - Exam ID
   * @returns Observable of Quiz array
   */
  getQuizzesByExamId(examId: number): Promise<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quiz/${examId}`).toPromise();
  }
}