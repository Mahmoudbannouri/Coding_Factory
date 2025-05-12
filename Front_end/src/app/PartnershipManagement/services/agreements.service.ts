import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assessment } from '../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AgreementsService {

  private apiUrl = `http://localhost:8088/Partnership/assessments`; // Assuming you have the API base URL in your environment file

  constructor(private http: HttpClient) {}

  // Create a new assessment
  createAssessment(assessment: Assessment, partnershipId: number): Observable<Assessment> {
    const url = `${this.apiUrl}/add`;
    return this.http.post<Assessment>(url, assessment, {
      params: new HttpParams().set('partnershipId', partnershipId.toString()),
    });
  }

  // Get all assessments
  getAllAssessments(): Observable<Assessment[]> {
    const url = `http://localhost:8088/Partnership/assessments/all`;
    return this.http.get<Assessment[]>(url);
  }

  // Get assessment by ID
  getAssessmentById(id: number): Observable<Assessment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Assessment>(url);
  }

  getAssessmentsByPartnershipId(partnershipId: number): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.apiUrl}/partnership/${partnershipId}`);
  }
  

  // Update an assessment
  updateAssessment(id: number, assessment: Assessment): Observable<Assessment> {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<Assessment>(url, assessment);
  }

  // Delete an assessment
  deleteAssessment(id: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  // Delete all assessments
  deleteAllAssessments(): Observable<void> {
    const url = `${this.apiUrl}/deleteAll`;
    return this.http.delete<void>(url);
  }

  // Update status by admin
  /*updateStatusAdmin(id: number, status: AcceptanceStatus): Observable<Assessment> {
    const url = `${this.apiUrl}/${id}/update-status-admin`;
    return this.http.put<Assessment>(url, null, {
      params: new HttpParams().set('status', status),
    });
  }*/

  // Update status by partner
  /*updateStatusPartner(id: number, status: AcceptanceStatus): Observable<Assessment> {
    const url = `${this.apiUrl}/${id}/update-status-partner`;
    return this.http.put<Assessment>(url, null, {
      params: new HttpParams().set('status', status),
    });
  }*/

    // assessment.service.ts
    updateStatusAdmin(id: number, status: 'Accept' | 'Reject') {
      return this.http.put(`http://localhost:8088/Partnership/assessments/${id}/update-status-admin?status=${status}`, {});
    }
    

    updateStatusPartner(id: number, status: 'Accept' | 'Reject') {
      return this.http.put(`http://localhost:8088/Partnership/assessments/${id}/update-status-partner?status=${status}`, {});
    }
    
    markAsCompleted(id: number): Observable<Assessment> {
      return this.http.patch<Assessment>(`http://localhost:8088/Partnership/assessments/${id}/complete`, {});
    }
      
    // Mark an assessment as completed
 /* markAsCompleted(assessmentId: number): Observable<Assessment> {
    return this.http.patch<Assessment>(
      `http://localhost:8088/Partnership/assessments/{{id}}/complete`,
      {} // Empty body (since the backend handles logic)
    );
  } */

}
