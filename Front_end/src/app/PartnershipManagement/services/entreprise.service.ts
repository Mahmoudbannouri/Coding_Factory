import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Entreprise } from '../models/entreprise';
import { User } from 'app/models/User';

@Injectable({
  providedIn: 'root',
})
export class EntrepriseService {
  private baseUrl = 'http://localhost:8088/Partnership'; // Base URL from Swagger

  constructor(private http: HttpClient) {}

  // Fetch all entreprises
  getEntreprises(): Observable<Entreprise[]> {
    const url = `${this.baseUrl}/entreprises/getListEntreprise`;
    return this.http.get<Entreprise[]>(url).pipe(
      tap((data) => console.log('Fetched entreprises:', data)), // Log the response
      catchError(this.handleError)
    );
  }
 addEntrepriseAndAssignToUserClient(ent: Entreprise, idUser: number): Observable<Entreprise> {
    return this.http.post<Entreprise>(`http://localhost:8088/Partnership/entreprises/AddEntrepriseandAssignToUserClient/${idUser}`, ent);
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

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:8088/Partnership/entreprises/getPartner/${id}`);
  }

  getEntrepriseIdByPartnerId(partnerId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8088/Partnership/entreprises/partner/${partnerId}`);
  }
}