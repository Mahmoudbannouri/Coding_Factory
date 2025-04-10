import { Component } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'app/shared/auth/storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  loginForm: FormGroup;
  loginFormSubmitted = false;
  isLoginFailed = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
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

    this.authService.login(signinRequest).subscribe(
      (response) => {
        console.log('Login successful!');
        this.isLoginFailed = false;

        // Check role and redirect to dashboard1 for all roles
        if (StorageService.hasToken()) {
          const role = StorageService.getUserRole(); // Get the logged-in user role

          // Redirect all roles to dashboard1
          this.router.navigateByUrl('/dashboard/dashboard1');
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.isLoginFailed = true;
      }
    );
  }
}
