import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../../../shared/directives/must-match.validator';
import { AuthService } from 'app/shared/auth/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  registerFormSubmitted = false;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Only numbers allowed
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]], // At least 6 characters
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  selectRole(role: string): void {
    this.registerForm.patchValue({ role });
  }
  

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  get rf() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.registerFormSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const userData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      phoneNumber: this.registerForm.value.phoneNumber,
      address: this.registerForm.value.address,
      dateOfBirth: this.registerForm.value.dateOfBirth,
      password: this.registerForm.value.password,
      roles: [this.registerForm.value.role]
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        this.router.navigate(['/pages/login']);// ✅ Correct path
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }
}
