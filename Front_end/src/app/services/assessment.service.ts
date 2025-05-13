import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Partnership } from 'app/models/partnership';  // Import Partnership model
import { Assessment } from 'app/models/assessment.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private baseUrl = 'http://localhost:8090/Partnership'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Get all partnerships
  getAllPartnerships(): Observable<Partnership[]> {
    return this.http.get<Partnership[]>(`${this.baseUrl}/partnerships/all`);
  }

  // Get all assessments
  getAllAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/assessments/all`);
  }
  
  // Create a new assessment
  createAssessment(newAssessment: Assessment): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments/add`, newAssessment);
  }

  // Get assessment by ID
  getAssessmentById(id: number): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.baseUrl}/assessments/${id}`);
  }

  // Update status by Admin
  updateStatusAdmin(id: number, status: string): Observable<Assessment> {
    return this.http.put<Assessment>(`${this.baseUrl}/assessments/${id}/update-status-admin`, { status });
  }

  // Update status by Partner
  updateStatusPartner(id: number, status: string): Observable<Assessment> {
    return this.http.put<Assessment>(`${this.baseUrl}/assessments/${id}/update-status-partner`, { status });
  }
}
