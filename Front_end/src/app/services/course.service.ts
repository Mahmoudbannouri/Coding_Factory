import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { Course } from '../models/courses';
import { User } from '../models/User';
import { Page } from '../models/page';
import {StorageService} from '../shared/auth/storage.service';

interface ApiCourseResponse {
  course: Course;
  qrCodeUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8090/courses';
  private authApiUrl = 'http://localhost:8090/api/v1/auth';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }
// In your course.service.ts
  addCourse(course: Course, trainerId: number): Observable<Course> {
    return this.http.post<Course>(
      `${this.apiUrl}?trainerId=${trainerId}`,
      course,
      { headers: this.getAuthHeaders() }
    );
  }
// In course.service.ts
  getAllCoursesWithPagination(
    searchQuery: string = '',
    category: string = '',
    page: number = 0,
    size: number = 6
  ): Observable<Page<Course>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (category) params = params.set('category', category);

    return this.http.get<Page<Course>>(`${this.apiUrl}/search`, { params });
  }
  enrollCurrentUser(courseId: number): Observable<Course> {
    const user = StorageService.getUser();
    return this.http.post<Course>(
      `${this.apiUrl}/${courseId}/enroll`,
      {},
      { params: { studentId: user.id.toString() } }
    );
  }
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting course:', error);
        return throwError(() => new Error('Failed to delete course'));
      })
    );
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course).pipe(
      catchError(error => {
        console.error('Error updating course:', error);
        return throwError(() => new Error('Failed to update course'));
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching course:', error);
        return throwError(() => new Error('Failed to fetch course'));
      })
    );
  }
  getTrainerName(courseId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${courseId}/trainer-name`).pipe(
      catchError(error => {
        console.error('Error fetching trainer name:', error);
        return throwError(() => new Error('Failed to fetch trainer name'));
      })
    );
  }
  getCourseQRCodeBase64(id: number): Observable<{ qrCodeBase64: string, downloadUrl: string }> {
    return this.http.get<{ qrCodeBase64: string, downloadUrl: string }>(
      `${this.apiUrl}/${id}/qr-code-base64`
    ).pipe(
      catchError(error => {
        console.error('Error fetching QR code:', error);
        return throwError(() => new Error('Failed to fetch QR code'));
      })
    );
  }


  unenrollStudent(courseId: number, studentId: number): Observable<void> {
    if (!courseId) {
      return throwError(() => new Error('Course ID is required'));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/${courseId}/students/${studentId}`,
      {
        headers: this.getAuthHeaders(),
        withCredentials: true
      }
    ).pipe(
      catchError(error => {
        console.error('Error unenrolling student:', error);
        return throwError(() => new Error('Failed to unenroll student'));
      })
    );
  }
  // Enroll a student in a course
  enrollStudentInCourse(courseId: number, studentId: number): Observable<Course> {
    return this.http.post<Course>(
      `${this.apiUrl}/${courseId}/enroll/${studentId}`,
      null,  // No body needed for this request
      { headers: this.getAuthHeaders() }
    );
  }


  private getAuthHeaders(): HttpHeaders {
    const token = StorageService.getToken();
    if (!token) {
      console.error('No token found');
      return new HttpHeaders();  // Return empty headers if no token is found
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getMyCourses(): Observable<Course[]> {
    const user = StorageService.getUser();
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    let userRole = StorageService.getUserRole();
    // Remove brackets and ensure proper case
    userRole = userRole.replace(/[\[\]]/g, '').toUpperCase();

    const params = new HttpParams()
      .set('userId', user.id.toString())
      .set('userRole', userRole);

    return this.http.get<Course[]>(`${this.apiUrl}/my-courses`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      tap(courses => console.log('Received courses:', courses)),
      catchError(error => {
        console.error('Error fetching courses:', error);
        return throwError(() => new Error('Failed to fetch courses'));
      })
    );
  }
  getAllStudentsWithDetails(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.authApiUrl}/students`, {
      headers: headers,
      withCredentials: true
    }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Redirect to login or show permission error
          console.error('Permission denied - redirecting to login');
          // Add your redirect logic here
        }
        return throwError(() => new Error('Failed to fetch students with details'));
      })
    );
  }
  getEnrolledStudentsWithDetails(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${courseId}/students/details`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error('Error fetching enrolled students:', error);
        if (error.status === 403) {
          console.error('Forbidden: You do not have permission to access these details.');
        }
        return throwError(() => new Error('Failed to fetch students'));
      })
    );
  }


  getEnrolledStudents(courseId: number): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/${courseId}/students`,
      {
        headers: this.getAuthHeaders(),
        withCredentials: true
      }
    ).pipe(
      catchError(error => {
        console.error('Error fetching enrolled students:', error);
        return throwError(() => new Error('Failed to fetch enrolled student IDs'));
      })
    );
  }
  getAllStudents(): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.authApiUrl}/students/ids`,
      {
        headers: this.getAuthHeaders()
      }
    ).pipe(
      catchError(error => {
        console.error('Error fetching all students:', error);
        return throwError(() => new Error('Failed to fetch student IDs'));
      })
    );
  }

  hasStudentReviewed(studentId: number, courseId: number): Observable<{hasReviewed: boolean}> {
    return this.http.get<{hasReviewed: boolean}>(
      `${this.apiUrl}/reviews/has-reviewed/${studentId}/${courseId}`
    );
  }
  searchAllCourses(
    searchQuery: string = '',
    category: string = ''
  ): Observable<Course[]> {
    let params = new HttpParams();
    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (category) params = params.set('category', category);

    return this.http.get<Course[]>(`${this.apiUrl}/search-all`, { params });
  }
  searchAllMyCourses(
    searchQuery: string = '',
    category: string = ''
  ): Observable<Course[]> {
    const user = StorageService.getUser();
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    let userRole = StorageService.getUserRole();
    userRole = userRole.replace(/[\[\]]/g, '').toUpperCase();

    let params = new HttpParams()
      .set('userId', user.id.toString())
      .set('userRole', userRole);

    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (category) params = params.set('category', category);

    return this.http.get<Course[]>(`${this.apiUrl}/my-courses/search-all`, {
      params,
      headers: this.getAuthHeaders()
    });
  }
  searchMyCourses(
    searchQuery: string = '',
    category: string = '',
    page: number = 0,
    size: number = 6
  ): Observable<Page<Course>> {
    const user = StorageService.getUser();
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    let userRole = StorageService.getUserRole();
    userRole = userRole.replace(/[\[\]]/g, '').toUpperCase();

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('userId', user.id.toString())
      .set('userRole', userRole);

    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (category) params = params.set('category', category);

    return this.http.get<Page<Course>>(`${this.apiUrl}/my-courses/search`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

}
