import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnDestroy {
  email: string = '';
  resendDisabled = false;
  resendCountdown = 30;
  isProcessing = false;
  successMessage = '';
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || '';
  }

  resendVerification() {
    if (this.resendDisabled || this.isProcessing) return;

    this.isProcessing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resendVerificationEmail(this.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isProcessing = false;
          if (res.status === 'success') {
            this.successMessage = res.message || 'Verification email resent successfully!';
            this.startResendCountdown();
          } else {
            this.errorMessage = res.message || 'Failed to resend verification email';
          }
        },
        error: (err) => {
          this.isProcessing = false;
          if (err.status === 404) {
            this.errorMessage = 'Email address not found. Please register again.';
          } else if (err.status === 400 && err.error?.message?.includes('already verified')) {
            this.errorMessage = 'This account is already verified. You can log in now.';
            setTimeout(() => {
              this.router.navigate(['/pages/login']);
            }, 3000);
          } else {
            this.errorMessage = err.error?.message || 'Failed to resend verification email. Please try again later.';
          }
        }
      });
  }

  startResendCountdown() {
    this.resendDisabled = true;
    this.resendCountdown = 30;
    
    const countdownInterval = setInterval(() => {
      this.resendCountdown--;
      
      if (this.resendCountdown <= 0) {
        clearInterval(countdownInterval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}