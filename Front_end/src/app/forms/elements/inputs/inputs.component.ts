import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

export class User {
  public fname: string;
  public lname: string;
  public city: string;
}

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent {

  user: User;
  model = new User();
  submitted = false;

  employeeForm = new UntypedFormGroup({
    fname: new UntypedFormControl('Mark', [Validators.required]),
    lname: new UntypedFormControl('Otto', [Validators.required]),
    city: new UntypedFormControl('', [Validators.required])
  });

  constructor() {
    this.model = {
      fname: 'Mark',
      lname: 'Otto',
      city: ''
    }
  }

  onSubmit(form) {
    console.log(form.value)
  }

  get f() {
    return this.employeeForm.controls;
  }

  onReactiveFormSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    console.log(this.employeeForm.value);
  }
}
