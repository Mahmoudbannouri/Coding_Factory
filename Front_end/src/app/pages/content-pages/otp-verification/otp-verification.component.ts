import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnDestroy {
  email: string;
  otpForm: FormGroup;
  loading: boolean = false;
  countdown: number = 300; // 5 minutes
  countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.email = this.route.snapshot.queryParams['email'] || '';
    
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.startCountdown();
  }

  startCountdown() {
    clearInterval(this.countdownInterval); // Clear any existing interval
    this.countdown = 300; // Reset to 5 minutes
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  get countdownFormatted(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

 // otp-verification.component.ts
verifyOtp() {
  if (this.otpForm.invalid) {
    this.toastr.error('Please enter a valid 6-digit OTP');
    return;
  }

  this.loading = true;
  const otp = this.otpForm.get('otp')?.value;

  this.authService.verifyOTP(this.email, otp).subscribe({
    next: (response) => {
      this.loading = false;
      if (response.status === 'success') {
        this.toastr.success(response.message || 'OTP verified successfully!');
        // Navigate to reset password page
        this.router.navigate(['/pages/reset-password'], { 
          queryParams: { email: this.email } 
        });
      } else {
        this.toastr.error(response.message || 'OTP verification failed');
      }
    },
    error: (err) => {
      this.loading = false;
      this.toastr.error(err.error?.message || 'OTP verification failed');
    }
  });
}

resendOtp() {
  this.loading = true;
  this.authService.forgotPassword(this.email).subscribe({
    next: (response) => {
      this.loading = false;
      this.startCountdown(); // Reset the countdown
      this.toastr.success(response.message || 'New OTP sent successfully');
    },
    error: (err) => {
      this.loading = false;
      this.toastr.error(err.error?.message || 'Failed to resend OTP');
    }
  });
}
  ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }
}
