import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'app/shared/auth/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loginFormSubmitted = false;
  isLoginFailed = false;
  verifiedEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initLoginForm();
    this.checkVerificationStatus();
  }

  private checkVerificationStatus() {
    this.route.queryParams.subscribe(params => {
      if (params['verified'] === 'true' && params['email']) {
        this.verifiedEmail = params['email'];
        this.loginForm.patchValue({ email: this.verifiedEmail });
        this.showVerificationSuccessToast();
        
        // Clear query params after showing toast
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true
        });
      }
    });
  }

  private showVerificationSuccessToast() {
    this.toastr.success(
      `Your email ${this.verifiedEmail} has been verified successfully!`,
      'Verification Successful',
      {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true
      }
    );
  }

  private initLoginForm() {
    this.loginForm = this.fb.group({
      email: [this.verifiedEmail || '', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }

  get lf() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.loginFormSubmitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }

    const signinRequest = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value
    };

    this.authService.login(signinRequest).subscribe({
      next: () => {
        this.isLoginFailed = false;
        const role = StorageService.getUserRole();

        if (role === "[ADMIN]") {
          this.router.navigate(['/dashboard/dashboard2']);
        } else {
          this.router.navigate(['/dashboard/dashboard1']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoginFailed = true;
        
        // Clear password field on failed login
        this.loginForm.get('password')?.reset();
      }
    });
  }
}