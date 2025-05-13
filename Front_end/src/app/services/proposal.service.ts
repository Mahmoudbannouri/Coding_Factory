import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Proposal } from '../models/proposal';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
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
    return throwError(() => errorMessage);
  }

  getProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.baseUrl}/proposals/all`).pipe(
      tap(data => console.log('Received proposals:', data)),
      catchError(this.handleError)
    );
  }

  getProposal(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${this.baseUrl}/proposals/${id}`).pipe(
      tap(data => console.log('Received proposal:', data)),
      catchError(this.handleError)
    );
  }

  createProposal(proposal: Proposal): Observable<Proposal> {
    return this.http.post<Proposal>(`${this.baseUrl}/proposals/add`, proposal).pipe(
      tap(data => console.log('Created proposal:', data)),
      catchError(this.handleError)
    );
  }

  updateProposal(proposal: Proposal): Observable<Proposal> {
    return this.http.put<Proposal>(`${this.baseUrl}/proposals/update/${proposal.idProposal}`, proposal).pipe(
      tap(data => console.log('Updated proposal:', data)),
      catchError(this.handleError)
    );
  }

  deleteProposal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/proposals/delete/${id}`).pipe(
      tap(() => console.log('Deleted proposal:', id)),
      catchError(this.handleError)
    );
  }

  deleteExpiredProposals(): Observable<void> {
    const url = `${this.baseUrl}/proposals/deleteExpired`;
    console.log('Sending DELETE request to:', url);
    
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Expired proposals deleted successfully')),
      catchError((error) => {
        console.error('Error deleting expired proposals:', error);
        return throwError(() => error);
      })
    );
  }
  
}  
