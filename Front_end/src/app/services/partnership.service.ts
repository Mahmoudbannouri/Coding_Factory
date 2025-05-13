import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Partnership } from '../models/partnership';
import { environment } from 'environments/environment';

import { HttpParams } from '@angular/common/http';
import { Entreprise } from 'app/models/entreprise';
import {Proposal} from '../models/proposal';


@Injectable({
  providedIn: 'root'
})
export class PartnershipService {
  private baseUrl = 'http://localhost:8090/Partnership';

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
    return this.http.get<Partnership>(`${this.baseUrl}/details/${partnershipId}`);
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
    const url = `http://localhost:8088/Partnership/api/zoom/create-meeting?topic=Partnership Offer Meeting&startTime=2026-03-05T10:00:00&duration=60&accessToken=eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjE5ZTllODNkLTY5YTItNDcxMy1iOTdiLWFjYjRkMDdmN2VlMiJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJSaW5BY0tnM1N1MmoyNGJ3RU1mLXh3IiwidmVyIjoxMCwiYXVpZCI6IjUyNDRiMjc0Y2Y0ZjhkODEwYzk2Nzg3NzViNTliYjgwMWI3ODFmOWQ2YjU4YzY3N2YxZjQxODZiODI0OTFhZjYiLCJuYmYiOjE3NDQ2NDU2OTksImNvZGUiOiJEeTc3aExFRDdPUWZPdjBNUl9RUmEyYnpPbVBXVmdOSGciLCJpc3MiOiJ6bTpjaWQ6b2dDOWdzbzFSSXl4bzJFZ2dydDRhUSIsImdubyI6MCwiZXhwIjoxNzQ0NjQ5Mjk5LCJ0eXBlIjowLCJpYXQiOjE3NDQ2NDU2OTksImFpZCI6Il9EZWhDM05BVEJXZDQwcVJ1NlRhaHcifQ.8Y_XNebjjs6H7CLSww_-1TYRguywpKCsyqinY296HIsuK_Kg4vLZbx9zM8mdPX1hKcPuE3D5tT39yymExUqo0A&recipientEmail=rabie.zerrim@esprit.tn`;
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

}
