import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { PerformanceRequest, PerformanceResponse } from 'app/models/performance';


@Injectable({
  providedIn: 'root'
})
export class StudentPerformanceService {
  private apiUrl = `${environment.apiBaseUrl}/api/predict`;

  constructor(private http: HttpClient) { }

  predictPerformance(data: PerformanceRequest): Observable<PerformanceResponse> {
    return this.http.post<PerformanceResponse>(this.apiUrl, data);
  }

  getPerformanceInterpretation(prediction: string): string {
    const interpretations = {
      'Failed': 'The student is at risk of failing and may need immediate intervention.',
      'Passable': 'The student meets minimum requirements but could improve with support.',
      'Good': 'The student performs above average with consistent results.',
      'Very Good': 'The student demonstrates strong academic achievement.',
      'Excellent': 'The student shows outstanding performance across all metrics.'
    };
    return interpretations[prediction as keyof typeof interpretations] || 'Performance interpretation not available.';
  }
}