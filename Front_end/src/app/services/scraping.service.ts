import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrapingService {
  private apiUrl = 'http://localhost:8090/Partnership/scraping'; // URL of the Flask API

  constructor(private http: HttpClient) { }

  getScrapedData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/scrape`); // Make GET request to the Flask API
  }
  getTop5RelevantCompanies(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8090/Partnership/scraping/top5-keywords'); // Call top5-keywords endpoint
  }
  
}