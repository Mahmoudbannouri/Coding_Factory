import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8090/reviews'; // Adjust URL to your Reviews Microservice

  constructor(private http: HttpClient) {}

  addReview(review: any): Observable<any> {
    return this.http.post(this.apiUrl, review);
  }
}