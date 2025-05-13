import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { StorageService } from './storage.service';
import { catchError, tap } from 'rxjs/operators';

interface VerificationResponse {
  success: boolean;
  message: string;
  verified: boolean;
  timestamp?: string;
  email?: string;
}

const BASIC_URL = 'http://localhost:8090';
export const AUTH_HEADER = 'Authorization';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService) {}

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
            roles: [body.role]
          });
        }
      }),
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    return StorageService.hasToken();
  }

  verifyEmail(token: string): Observable<VerificationResponse> {
    const params = new HttpParams().set('token', token);
    
    return this.http.get<VerificationResponse>(
      `${BASIC_URL}/api/v1/auth/verify`,
      { params }
    ).pipe(
      tap(response => {
        console.log('Verification response:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Verification error:', error);

        const errorResponse: VerificationResponse = {
          success: false,
          message: error.error?.message || 'Verification failed',
          verified: false
        };

        return throwError(() => errorResponse);
      })
    );
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(
      `${BASIC_URL}/api/v1/auth/resend-verification`,
      {},
      {
        params: { email },
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap(_ => console.log('Verification email resent')),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private log(message: string) {
    console.log(message);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${BASIC_URL}/api/v1/auth/forgot-password`, { email }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${BASIC_URL}/api/v1/auth/verify-otp`, { email, otp }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${BASIC_URL}/api/v1/auth/reset-password`, { email, newPassword }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

}
