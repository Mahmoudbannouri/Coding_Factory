import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {
  private apiUrl = 'http://localhost:8080/api/v1/certificates';

  constructor(private http: HttpClient) { }

  downloadCertificate(userId: number, examId: number): Observable<Blob> {
    const url = `${this.apiUrl}/download/${userId}/${examId}`;
    console.log('Download certificate URL:', url);
    return this.http.get(url, { responseType: 'blob' });
  }
}
