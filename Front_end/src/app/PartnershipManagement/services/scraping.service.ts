import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Injectable({
  providedIn: 'root'
})
export class ScrapingService {
  private apiUrl = 'http://localhost:8088/Partnership/scraping'; // URL for scraping-related endpoints
  private apiUrl2 = 'http://localhost:8088/Partnership/prediction'; // URL for prediction-related endpoints
  private apiUrl3 = 'http://localhost:5001'; 
  constructor(private http: HttpClient) { }

  getScrapedData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/scrape`); // Make GET request to the scrape endpoint
  }

  getTop5RelevantCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top5-keywords`); // Call top5-keywords endpoint
  }

  getScrapedCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all`); // Call get-all endpoint
  }

  resetElegibility(): Observable<any> {
    return this.http.put(`${this.apiUrl}/reset-elegibility`, {}, { responseType: 'text' }); // Call reset-elegibility endpoint
  }

  predictAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}/predictAll`); // Call predictAll endpoint
  }

  // New method to ask a question
  askQuestion(question: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl2}/ask`, { question }); // Call ask endpoint with the question
  }
  compareCompanies(company1: string, company2: string): Observable<any> {
    return this.http.post(`http://localhost:5001/compare_companies_graph`, { company1, company2 });
  }
}
