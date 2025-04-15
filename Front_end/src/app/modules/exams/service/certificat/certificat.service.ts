import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {
  private apiUrl = 'http://localhost:8080/api/v1/certificates';

  constructor(private http: HttpClient) { }

  downloadCertificate(userId: number, examId: number,email:String): void {
    const url = `${this.apiUrl}/download/${userId}/${examId}/${email}`;
    console.log('Download certificate URL:', url);
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `certificate_${userId}_${examId}.pdf`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
