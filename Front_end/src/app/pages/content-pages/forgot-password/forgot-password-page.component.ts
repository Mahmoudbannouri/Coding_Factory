// forgot-password-page.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent {
  currentStep: number = 1;
  passwordForm: FormGroup;
  email: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOtp() {
    if (this.passwordForm.invalid) {
      this.toastr.error('Please enter a valid email.');
      return;
    }

    this.loading = true;
    this.email = this.passwordForm.value.email;

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'success') {
          this.toastr.success(res.message || 'OTP sent successfully!');
          // Navigate to OTP verification page with email as query param
          this.router.navigate(['/pages/otp-verification'], { 
            queryParams: { email: this.email } 
          });
        } else {
          this.toastr.error(res.message || 'Failed to send OTP.');
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Failed to send OTP.');
      }
    });
  }
}