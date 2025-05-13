import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { StorageService } from 'app/shared/auth/storage.service'; // Make sure this path is correct

const USERS_URL = 'http://localhost:8080/api/v1/auth/users'; // Update with your actual API URL

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // Helper method to create headers with authorization token
  private createAuthorizationHeader(): HttpHeaders {
    const token = StorageService.getToken(); // Using static method
    console.log('Using token:', token); // Debugging
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(USERS_URL, {
      headers: this.createAuthorizationHeader()
    });
  }

  // Enable a user
  enableUser(id: number): Observable<void> {
    return this.http.post<void>(
      `${USERS_URL}/${id}/enable`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  // Disable a user
  disableUser(id: number): Observable<void> {
    return this.http.post<void>(
      `${USERS_URL}/${id}/disable`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${USERS_URL}/${id}`,
      { headers: this.createAuthorizationHeader() }
    );
  }

  // Update a user
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(
      `${USERS_URL}/${id}`,
      user,
      { headers: this.createAuthorizationHeader() }
    );
  }
}
