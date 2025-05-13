import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Entreprise } from '../models/entreprise';

@Injectable({
  providedIn: 'root',
})
export class EntrepriseService {
  private baseUrl = 'http://localhost:8090/Partnership'; // Base URL from Swagger

  constructor(private http: HttpClient) {}

  // Fetch all entreprises
  getEntreprises(): Observable<Entreprise[]> {
    const url = `${this.baseUrl}/entreprises/getListEntreprise`;
    return this.http.get<Entreprise[]>(url).pipe(
      tap((data) => console.log('Fetched entreprises:', data)), // Log the response
      catchError(this.handleError)
    );
  }

  // Delete an entreprise
  deleteEntreprise(id: number): Observable<void> {
    const url = `${this.baseUrl}/entreprises/delete/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Entreprise deleted successfully:', id)), // Log success
      catchError(this.handleError)
    );
  }

  // Update an entreprise
  updateEntreprise(entreprise: Entreprise): Observable<void> {
    const url = `${this.baseUrl}/entreprises/update/${entreprise.idEntreprise}`;
    return this.http.put<void>(url, entreprise).pipe(
      tap(() => console.log('Entreprise updated successfully:', entreprise.idEntreprise)), // Log success
      catchError(this.handleError)
    );
  }

  createEntreprise(entreprise: Entreprise): Observable<Entreprise> {
    const url = `${this.baseUrl}/entreprises/add`; // Use the correct endpoint
    console.log('Creating entreprise with URL:', url); // Log the URL
    console.log('Request payload:', entreprise); // Log the payload
    return this.http.post<Entreprise>(url, entreprise).pipe(
      tap((createdEntreprise) => console.log('Entreprise created successfully:', createdEntreprise)), // Log success
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating entreprise:', error); // Log the error
        return throwError(() => new Error('Failed to create entreprise')); // Rethrow the error
      })
    );
  }

  // POST /AddEntrepriseandAssignToUser/{idUser}
  addEntrepriseAndAssignToUser(ent: Entreprise, idUser: number): Observable<Entreprise> {
    return this.http.post<Entreprise>(`${this.baseUrl}/entreprises/AddEntrepriseandAssignToUser/${idUser}`, ent);
  }

  // PUT /assignEntreprise/{idEntreprise}/toUser/{idUser}
  assignEntrepriseToUser(idEntreprise: number, idUser: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/entreprises/assignEntreprise/${idEntreprise}/toUser/${idUser}`, {}, { responseType: 'text' });
  }


  // Handle errors
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}