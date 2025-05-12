import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseResource } from '../models/CourseResource';

@Injectable({
  providedIn: 'root',
})
export class CourseResourceService {
  private baseURL = 'http://localhost:8081/course-resources';

  constructor(private httpClient: HttpClient) {}

  getAllResources(): Observable<CourseResource[]> {
    return this.httpClient.get<CourseResource[]>(`${this.baseURL}/retrieve-all-resources`);
  }

  getResourcesForCourse(courseId: number): Observable<CourseResource[]> {
    return this.httpClient.get<CourseResource[]>(`${this.baseURL}/course/${courseId}`);
  }

  addResource(resource: CourseResource): Observable<CourseResource> {
    return this.httpClient.post<CourseResource>(this.baseURL, resource);
  }

  updateResource(id: number, resource: CourseResource): Observable<CourseResource> {
    return this.httpClient.put<CourseResource>(`${this.baseURL}/${id}`, resource);
  }

  deleteResource(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }
}
