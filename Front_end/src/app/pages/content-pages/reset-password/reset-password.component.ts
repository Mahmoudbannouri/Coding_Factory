import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  email: string;
  token: string;
  resetForm: FormGroup;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.token = this.route.snapshot.queryParams['token'] || '';
    
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

 // reset-password.component.ts
resetPassword() {
  if (this.resetForm.invalid) {
    if (this.resetForm.get('newPassword')?.invalid) {
      this.toastr.error('Password must be at least 8 characters');
    } else if (this.resetForm.hasError('mismatch')) {
      this.toastr.error('Passwords do not match');
    }
    return;
  }

  this.loading = true;
  const newPassword = this.resetForm.get('newPassword')?.value;

  this.authService.resetPassword(this.email, newPassword).subscribe({
    next: (response) => {
      this.loading = false;
      if (response.status === 'success') {
        this.toastr.success(response.message || 'Password reset successfully!');
        this.router.navigate(['/pages/login']);
      } else {
        this.toastr.error(response.message || 'Password reset failed');
      }
    },
    error: (err) => {
      this.loading = false;
      this.toastr.error(err.error?.message || 'Password reset failed');
    }
  });
}
}
