import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Course } from '../models/courses';
import { User } from '../models/User';
import { Page } from '../models/page'; // You'll need to create this interface
import { StorageService } from 'app/shared/auth/storage.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

  private apiUrl = 'http://localhost:8090/courses';  // Requests go to Angular dev server
  constructor(private http: HttpClient,    private storageService: StorageService // Add this
  ) {}

  // Updated methods
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }
  getAllStudentsWithDetails(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/students/details`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  getStudentDetails(studentId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/students/${studentId}`,
      { headers: this.getAuthHeaders() }
    );
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
  
    console.log('Making request to /my-courses with params:', params.toString());
  
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

// In your course.service.ts
addCourse(course: Course, trainerId: number): Observable<Course> {
  return this.http.post<Course>(
    `${this.apiUrl}?trainerId=${trainerId}`,
    course,
    { headers: this.getAuthHeaders() }
  );
}

enrollCurrentUser(courseId: number): Observable<Course> {
  const user = StorageService.getUser();
  return this.http.post<Course>(
    `${this.apiUrl}/${courseId}/enroll`,
    {},
    { params: { studentId: user.id.toString() } }
  );
}

  private getAuthHeaders(): HttpHeaders {
    const token = StorageService.getToken();
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
}

uploadFile(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${StorageService.getToken()}`
    // Don't set Content-Type - browser will handle it
  });

  return this.http.post<string>(
    `${this.apiUrl}/upload`,
    formData,
    { headers }
  ).pipe(
    catchError(error => {
      console.error('Upload error:', error);
      return throwError(() => new Error('Upload failed'));
    })
  );
}
  // Delete a course
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Update a course
  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  // Get a course by ID
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  // Get trainer name by course ID
  getTrainerName(courseId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${courseId}/trainer-name`);
  }

  
  getEnrolledStudentsWithDetails(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/${courseId}/students/details`,
      { headers: this.getAuthHeaders() }
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

   // Fetch students enrolled in a specific course
  // Fetch students enrolled in a specific course
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
          return throwError(() => new Error('Failed to fetch students'));
      })
  );
}

getAllStudents(): Observable<number[]> {
  return this.http.get<number[]>(
    `${this.apiUrl}/students`,
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
downloadCoursePdf(courseId: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/${courseId}/pdf`, {
    responseType: 'blob',
    headers: this.getAuthHeaders()
  });
}


downloadCourseResourcesZip(courseId: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/${courseId}/zip`, {
    responseType: 'blob',
    headers: this.getAuthHeaders()
  });
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
getAllCoursesWithPagination(searchQuery: string = '', category: string = '', page: number = 0, size: number = 6): Observable<Page<Course>> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  if (searchQuery) {
    params = params.set('searchQuery', searchQuery);
  }
  if (category) {
    params = params.set('category', category);
  }

  return this.http.get<Page<Course>>(`${this.apiUrl}/search`, { params });
}
searchMyCourses(searchQuery: string = '', category: string = '', page: number = 0, size: number = 6): Observable<Page<Course>> {
  const user = StorageService.getUser();
  if (!user) {
    return throwError(() => new Error('User not authenticated'));
  }

  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('userId', user.id.toString())
    .set('userRole', StorageService.getUserRole());

  if (searchQuery) {
    params = params.set('searchQuery', searchQuery);
  }
  if (category) {
    params = params.set('category', category);
  }

  return this.http.get<Page<Course>>(`${this.apiUrl}/my-courses/search`, { params });
}
  
}
