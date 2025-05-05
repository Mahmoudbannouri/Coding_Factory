// recommendation.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { Course } from '../models/courses';
import { StorageService } from 'app/shared/auth/storage.service';
import {catchError, map} from 'rxjs/operators';
import { validateRating } from '../utils/rating.utils';
import {CategoryEnum} from '../models/CategoryEnum'; // Import the utility function

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private recommendationApiUrl = 'http://localhost:5000'; // Flask recommendation service

  constructor(private http: HttpClient) {}


// recommendation.service.ts

// Add these methods to the RecommendationService class
  getSimilarCourses(courseId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.recommendationApiUrl}/similar/${courseId}`).pipe(
      catchError(error => {
        console.error('Error fetching similar courses:', error);
        return throwError(() => new Error('Failed to get similar courses'));
      })
    );
  }

  getCategoryRecommendations(category: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.recommendationApiUrl}/category/${category}`).pipe(
      catchError(error => {
        console.error('Error fetching category recommendations:', error);
        return throwError(() => new Error('Failed to get category recommendations'));
      })
    );
  }
  getRecommendations(): Observable<Course[]> {
    const userId = StorageService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<any>(`${this.recommendationApiUrl}/recommend/${userId}`).pipe(
      map(response => {
        let courses = [];
        if (Array.isArray(response)) {
          courses = response;
        } else if (response.recommendations) {
          courses = response.recommendations;
        }

        // Map rating to rate
        return courses.map(course => ({
          ...course,
          rate: course.rating  // Map the rating field to rate
        }));
      }),
      catchError(error => {
        console.error('Error fetching recommendations:', error);
        return of([]);
      })
    );
  }
  getPopularCourses(): Observable<Course[]> {
    return this.http.get<any>(`${this.recommendationApiUrl}/popular`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response as Course[];
        } else if (response.recommendations) {
          return response.recommendations as Course[];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching popular courses:', error);
        return of([]); // Return empty array on error
      })
    );
  }

}
