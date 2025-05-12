import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:8080/Partnership/prediction';

  constructor(private http: HttpClient) { }

  getAndSavePredictionByCompanyId(companyId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8088/Partnership/prediction/savePredictionByCompanyId/${companyId}`);
  }

  predictAllCompaniesEligibility(): Observable<any> {
    return this.http.get<any>(`http://localhost:8088/Partnership/prediction/predictAll`);
  }
}
