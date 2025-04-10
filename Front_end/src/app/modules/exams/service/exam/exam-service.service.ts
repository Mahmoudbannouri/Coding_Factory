import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../../model/exam/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamServiceService {


  private apiUrl = 'http://localhost:8080/api/exams';

  constructor(private http: HttpClient) { }

  // Get all exams
  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  // Get exam by ID
  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  // Create a new exam
  createExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, exam);
  }

  // Update an existing exam
  updateExam(id: number, updatedExam: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, updatedExam);
  }

  // Delete an exam
  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Complete an exam
  completeExam(examId: number, userId: number, selectedAnswers: string[], username: string, examTitle: string): Observable<string> {
    const url = `${this.apiUrl}/complete`;
    const params = {
      examId: examId.toString(),
      userId: userId.toString(),
      username: username.toString(),
      examTitle: examTitle.toString()
    };
    return this.http.post(url, selectedAnswers, { params, responseType: 'text' });
  }
}
