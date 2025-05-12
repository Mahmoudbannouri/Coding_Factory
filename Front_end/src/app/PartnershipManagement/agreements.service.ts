// agreement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { agreement } from './models/agreement';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {
  private apiUrl = 'http://localhost:8088/Partnership/assessments';  // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  getAssessmentsByPartnership(partnershipId: number): Observable<agreement[]> {
    return this.http.get<agreement[]>(`${this.apiUrl}/partnership/${partnershipId}`);
  }
}
