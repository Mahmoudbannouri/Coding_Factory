import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/courses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8081/courses'; // Adjust URL to your API

  constructor(private http: HttpClient) {}

  // Fetch all courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  // Add a new course
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  getTrainerName(courseId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${courseId}/trainer-name`);
  }
  // Delete a course
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
