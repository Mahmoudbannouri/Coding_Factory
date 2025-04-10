import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseResource } from '../models/CourseResource';

@Injectable({
  providedIn: 'root',
})
export class CourseResourceService {
  private baseURL = 'http://localhost:8090/course-resources';

  constructor(private httpClient: HttpClient) {}

  // Existing methods
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

  // New file upload methods
  uploadDocument(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.baseURL}/upload-document`, formData, {
      responseType: 'text'
    });
  }

  uploadVideo(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.baseURL}/upload-video`, formData, {
      responseType: 'text'
    });
  }

  // Optional: If you need progress reporting
  uploadDocumentWithProgress(file: File): Observable<HttpEvent<string>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const req = new HttpRequest(
      'POST',
      `${this.baseURL}/upload-document`,
      formData,
      {
        reportProgress: true,
        responseType: 'text'
      }
    );
    
    return this.httpClient.request(req);
  }

  uploadVideoWithProgress(file: File): Observable<HttpEvent<string>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const req = new HttpRequest(
      'POST',
      `${this.baseURL}/upload-video`,
      formData,
      {
        reportProgress: true,
        responseType: 'text'
      }
    );
    
    return this.httpClient.request(req);
  }
}