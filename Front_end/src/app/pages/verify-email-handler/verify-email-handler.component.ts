import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'app/shared/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-email-handler',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-lg">
            <div class="card-body text-center">
              <div *ngIf="loading">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Verifying your email...</p>
              </div>
              
              <div *ngIf="!loading && success" class="alert alert-success">
                <i class="bi bi-check-circle-fill me-2"></i>
                Email verified successfully! You can now login.
                <div class="mt-3">
                  <a routerLink="/pages/login" class="btn btn-primary">Go to Login</a>
                </div>
              </div>
              
              <div *ngIf="!loading && !success" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{errorMessage}}
                <div class="mt-3">
                  <button *ngIf="canResend" (click)="resendVerification()" class="btn btn-secondary me-2">
                    Resend Verification
                  </button>
                  <a routerLink="/pages/register" class="btn btn-primary">Register Again</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./verify-email-handler.component.scss']
})
export class VerifyEmailHandlerComponent implements OnInit {
  loading = true;
  success = false;
  errorMessage = '';
  canResend = false;
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.email = params['email'];

      if (!token) {
        this.handleError('Invalid verification link - no token provided');
        this.canResend = !!this.email;
        return;
      }

      this.verifyEmail(token);
    });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
  }

  verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        if (response.success || response.verified) {
          this.success = true;
          // Redirect to success page
          this.router.navigate(['/pages/verification-success'], {
            queryParams: { email: this.email },
            replaceUrl: true
          });
        } else {
          this.handleError(response.message || 'Verification failed');
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.handleError(errorResponse.error?.message || 'Unexpected error occurred');
      }
    });
  }

  private handleVerificationError(err: HttpErrorResponse): void {
    if (err.status === 409 || (err.error && err.error.verified)) {
      // For already verified accounts, go straight to success page
      this.router.navigate(['/pages/verification-success'], {
        queryParams: { email: this.email },
        replaceUrl: true
      });
    } else {
      this.errorMessage = err.error?.message || 'Verification failed';
      this.canResend = !!this.email;
    }
  }

  resendVerification(): void {
    if (!this.email) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.resendVerificationEmail(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.success = false;
        this.errorMessage = 'Verification email resent. Please check your inbox.';
        this.canResend = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.handleVerificationError(err);
      }
    });
  }
}
