import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Partnership } from '../models/partnership';
import { environment } from 'environments/environment';

import { HttpParams } from '@angular/common/http';
import { Entreprise } from '../models/entreprise';
import { Proposal } from '../models/proposal';


@Injectable({
  providedIn: 'root'
})
export class PartnershipService {
  private baseUrl = 'http://localhost:8088/Partnership';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  getEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(`${this.baseUrl}/entreprises/getListEntreprise`);
  }
  getPartnershipById(partnershipId: number): Observable<Partnership> {
    return this.http.get<Partnership>(`${this.baseUrl}/partnerships/${partnershipId}`);
  }
  getProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.baseUrl}/proposals/all`);
  }
  acceptPartnership(partnershipId: number, entrepriseId: number): Observable<any> {
    const url = `${this.baseUrl}/partnerships/accept/${partnershipId}/${entrepriseId}`;
    return this.http.post(url, {});
  }
  getPartnerships(): Observable<Partnership[]> {
    const url = `${this.baseUrl}/partnerships/all`;
    return this.http.get<Partnership[]>(url).pipe(
      tap(data => console.log('Received partnerships:', data)),
      catchError(this.handleError)
    );
  }

  getPartnershipsByPartnerId(partnerId: number): Observable<Partnership[]> {
  return this.http.get<Partnership[]>(`http://localhost:8088/Partnership/partnerships/by-user/${partnerId}`);
}



  getPartnership(id: number): Observable<Partnership> {
    const url = `${this.baseUrl}/partnerships/${id}`;
    return this.http.get<Partnership>(url).pipe(
      tap(data => console.log('Received partnership:', data)),
      catchError(this.handleError)
    );
  }

  createPartnership(partnership: Partnership): Observable<Partnership> {
    const url = `${this.baseUrl}/partnerships/add`;
    return this.http.post<Partnership>(url, partnership).pipe(
      tap(data => console.log('Created partnership:', data)),
      catchError(this.handleError)
    );
  }

   applyForPartnership(entrepriseId: number, proposalId: number): Observable<Partnership> {
    const url = `http://localhost:8088/Partnership/partnerships/applyForPartnership/${entrepriseId}/${proposalId}`;
    return this.http.post<Partnership>(url, {});
  }

  
  updatePartnership(id: number, partnership: Partnership): Observable<Partnership> {
    const url = `${this.baseUrl}/partnerships/update/${id}`;
    return this.http.put<Partnership>(url, partnership).pipe(
      tap(data => console.log('Updated partnership:', data)),
      catchError(this.handleError)
    );
  }

  deletePartnership(id: number): Observable<void> {
    const url = `${this.baseUrl}/partnerships/delete/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Deleted partnership:', id)),
      catchError(this.handleError)
    );
  }
  generatePartnershipPdf(id: number): Observable<Blob> {
    const url = `http://localhost:8088/Partnership/partnerships/partnerships/${id}/pdf`; // Corrected URL
    return this.http.get(url, { responseType: 'blob' }).pipe(
      tap((response) => console.log('PDF generated')),
      catchError(this.handleError)
    );
  }
  
  createMeeting(topic: string, startTime: string, duration: number, accessToken: string, recipientEmail: string): Observable<string> {
    const url = `http://localhost:8088/Partnership/api/zoom/create-meeting?topic=Partnership Offer Meeting&startTime=2026-03-05T10:00:00&duration=60&accessToken=eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjFmNGI3MTg4LTQzOTItNGI5Yi1hZDZiLTI5NTM3MTFiODViOCJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJSaW5BY0tnM1N1MmoyNGJ3RU1mLXh3IiwidmVyIjoxMCwiYXVpZCI6IjUyNDRiMjc0Y2Y0ZjhkODEwYzk2Nzg3NzViNTliYjgwMWI3ODFmOWQ2YjU4YzY3N2YxZjQxODZiODI0OTFhZjYiLCJuYmYiOjE3NDQ4NzY1OTIsImNvZGUiOiJEeTc3aExFRDdPUWZPdjBNUl9RUmEyYnpPbVBXVmdOSGciLCJpc3MiOiJ6bTpjaWQ6b2dDOWdzbzFSSXl4bzJFZ2dydDRhUSIsImdubyI6MCwiZXhwIjoxNzQ0ODgwMTkyLCJ0eXBlIjowLCJpYXQiOjE3NDQ4NzY1OTIsImFpZCI6Il9EZWhDM05BVEJXZDQwcVJ1NlRhaHcifQ.t2KjSuRf4Jknrp9gbCvL4jvuZ6HlUWXja28YeU9Q2ARiPP2cyuWAS48cD4jQr3w9VLVQ6iHX4IIHTwA-hAGoYQ&recipientEmail=rabie.zerrim@esprit.tn`;
    const params = {
        topic,
        startTime,
        duration,
        accessToken,
        recipientEmail
    };
    return this.http.post<string>(url, params).pipe(
        tap(response => console.log('Meeting created and invitations sent successfully:', response)),
        catchError(this.handleError)
    );
}

   // Fetch partnerships by Entreprise ID
   getPartnershipsByEntrepriseId(idEntreprise: number): Observable<Partnership[]> {
    const url = `http://localhost:8088/Partnership/partnerships/entreprises/${idEntreprise}/partnerships`;
    console.log('Request URL:', url); // Log the URL to debug
    return this.http.get<Partnership[]>(url);
  }

  /**
 * Fetch an entreprise by its name.
 */
getEntrepriseByName(nameEntreprise: string): Observable<Entreprise> {
  const params = new HttpParams().set('nameEntreprise', nameEntreprise);
  return this.http.get<Entreprise>(`${this.baseUrl}/findEntrepriseByName`, { params })
    .pipe(catchError(this.handleError));
}

/**
 * Add a proposal by entreprise name.
 */
addPartnershipByEntrepriseName(nameEntreprise: string, proposal: Proposal): Observable<any> {
  const params = new HttpParams().set('nameEntreprise', nameEntreprise);
  return this.http.post<any>(`${this.baseUrl}/addProposalByEntrepriseName`, proposal, { params })
    .pipe(catchError(this.handleError));
}

embeddedSignSignatureRequest(): Observable<string> {
  return this.http.post(`https://fe61-196-229-11-125.ngrok-free.app/Partnership/api/sign/embeddedSing`, null, { responseType: 'text' });
}
 
terminatePartnership(id: number): Observable<any> {
  const url = `${this.baseUrl}/partnerships/${id}/terminate`; // Correct URL format
  return this.http.put<any>(url, {}).pipe(
    tap(response => console.log('Partnership terminated:', response)),
    catchError(this.handleError)
  );
}

}
