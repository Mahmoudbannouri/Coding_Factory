import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {StorageService} from '../shared/auth/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8090/reviews'; // Adjust URL to your Reviews Microservice

  constructor(private http: HttpClient) {}

  addReview(review: any): Observable<any> {
    return this.http.post(this.apiUrl, review).pipe(
      catchError(error => {
        // Convert the error to a consistent format
        if (error.error && typeof error.error === 'object') {
          throw error; // Already parsed error
        } else if (typeof error.error === 'string') {
          throw { ...error, error: { message: error.error } };
        } else {
          throw { ...error, error: { message: error.message || 'Unknown error' } };
        }
      })
    );
  }

  hasStudentReviewed(studentId: number, courseId: number): Observable<boolean> {
    return this.http.get<{hasReviewed: boolean}>(`${this.apiUrl}/has-reviewed`, {
      params: {
        studentId: studentId.toString(),
        courseId: courseId.toString()
      },
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.hasReviewed),
      catchError(error => {
        console.error('Error checking review status:', error);
        return of(false); // Return false if there's an error
      })
    );
  }
  private getAuthHeaders(): HttpHeaders {
    const token = StorageService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

getAIRecommendations(courseId: number): Observable<{ recommendations: string }> {
  console.log('Fetching AI recommendations for Course ID:', courseId);
  return this.http.get<{ recommendations: string }>(
    `${this.apiUrl}/courses/${courseId}/ai-recommendations`
  ).pipe(
    tap(response => console.log('API Response:', response)) // Log the API response
  );


}

deleteRecommendation(courseId: number, recommendationText: string): Observable<void> {
  console.log("Calling deleteRecommendation API for Course ID:", courseId, "Text:", recommendationText); // Debugging
  return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}/recommendations`, {
      params: { text: recommendationText }
  });
}
}
