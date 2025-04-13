import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { StorageService } from './storage.service';
import { catchError, tap } from 'rxjs/operators';

const BASIC_URL = 'http://localhost:8090';
export const AUTH_HEADER = 'Authorization';

@Injectable()
export class AuthService {
  storageService: StorageService;
  
  constructor(private http: HttpClient, private storage: StorageService) {}

  // Register method
  register(signupRequest: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    password: string;
    roles: string[];
  }): Observable<any> {
    return this.http.post<any>(`${BASIC_URL}/api/v1/auth/signup`, signupRequest)
      .pipe(
        tap(_ => this.log('User Registered Successfully')),
        catchError(this.handleError)
      );
  }

 // auth.service.ts
 login(signinRequest: { email: string, password: string }): Observable<any> {
  return this.http.post<any>(
    `${BASIC_URL}/api/v1/auth/signin`,
    signinRequest,
    { observe: 'response' }
  ).pipe(
    tap((res: HttpResponse<any>) => {
      const token = res.headers.get('Authorization')?.replace('Bearer ', '');
      const body = res.body;
      
      if (token && body) {
        this.storage.saveToken(token);
        this.storage.saveUser({
          id: body.userId,
          email: signinRequest.email,
          roles: [body.role] // Ensure this matches backend response
        });
      }
    })
  );
}

  log(message: string) {
    console.log(message);
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Unauthorized access';
    }
    return throwError(() => new Error(errorMessage));
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return StorageService.hasToken();
  }
}
