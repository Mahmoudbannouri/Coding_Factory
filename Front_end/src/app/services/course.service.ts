import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/courses';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

  private apiUrl = 'http://localhost:8090/courses'; // Adjust URL to your API

  constructor(private http: HttpClient) {}

  // Fetch all courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  // Add a new course
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
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

  // Fetch all students
  getAllStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/students`);
  }

  // Enroll a student in a course
  enrollStudentInCourse(courseId: number, studentId: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${courseId}/enroll/${studentId}`, {});
  }

   // Fetch students enrolled in a specific course
   getEnrolledStudents(courseId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${courseId}/students`);
  }

  
}
