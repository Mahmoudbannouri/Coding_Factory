import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss', '../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit {

  activeTab = "general";
  generalFormSubmitted = false;
  changePasswordFormSubmitted = false;
  infoFormSubmitted = false;
  alertVisible = true;

  countries = [
      { value: "USA", name: 'USA' },
      { value: "UK", name: 'UK'},
      { value: "Canada", name: 'Canada' },
  ];

  selectedLanguages = ["English", "Spanish"];
  languages = [
      { value: "English", name: 'English' },
      { value: "Spanish", name: 'Spanish'},
      { value: "French", name: 'French' },
      { value: "Russian", name: 'Russian' },
      { value: "German", name: 'German'},
      { value: "Hindi", name: 'Hindi' },
      { value: "Arabic", name: 'Arabic' },
      { value: "Sanskrit", name: 'Sanskrit'},
  ];

  selectedMusic = ["Jazz", "Hip Hop"];
  music = [
      { value: "Rock", name: 'Rock' },
      { value: "Jazz", name: 'Jazz'},
      { value: "Disco", name: 'Disco' },
      { value: "Pop", name: 'Pop' },
      { value: "Techno", name: 'Techno'},
      { value: "Folk", name: 'Folk' },
      { value: "Hip Hop", name: 'Hip Hop' },
  ];

  selectedMovies = ["The Dark Knight", "Perl Harbour"];
  movies = [
      { value: "Avatar", name: 'Avatar' },
      { value: "The Dark Knight", name: 'The Dark Knight'},
      { value: "Harry Potter", name: 'Harry Potter' },
      { value: "Iron Man", name: 'Iron Man' },
      { value: "Spider Man", name: 'Spider Man'},
      { value: "Perl Harbour", name: 'Perl Harbour' },
      { value: "Airplane!", name: 'Airplane!' },
  ];

  generalForm = new UntypedFormGroup({
    username: new UntypedFormControl('hermione007', [Validators.required]),
    name: new UntypedFormControl('Hermione Granger', [Validators.required]),
    email: new UntypedFormControl('granger007@hogward.com', [Validators.required]),
    company: new UntypedFormControl('', [Validators.required])
  });

  changePasswordForm = new UntypedFormGroup({
    oldPassword: new UntypedFormControl('', [Validators.required]),
    newPassword: new UntypedFormControl('', [Validators.required]),
    retypeNewPassword: new UntypedFormControl('', [Validators.required])
  });

  infoForm = new UntypedFormGroup({
    bdate: new UntypedFormControl('', [Validators.required]),
    bio: new UntypedFormControl(''),
    phone: new UntypedFormControl('', [Validators.required]),
    website: new UntypedFormControl('')
  });

  socialForm = new UntypedFormGroup({
    twitter: new UntypedFormControl(''),
    facebook: new UntypedFormControl(''),
    googlePlus: new UntypedFormControl(''),
    linkedin: new UntypedFormControl(''),
    instagram: new UntypedFormControl(''),
    quora: new UntypedFormControl('')
  });

  constructor() { }

  ngOnInit() {
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  get gf() {
    return this.generalForm.controls;
  }

  get cpf() {
    return this.changePasswordForm.controls;
  }

  get inf() {
    return this.infoForm.controls;
  }

  onGeneralFormSubmit() {
    this.generalFormSubmitted = true;
    if (this.generalForm.invalid) {
      return;
    }
  }

  onChangePasswordFormSubmit() {
    this.changePasswordFormSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
  }

  onInfoFormSubmit() {
    this.infoFormSubmitted = true;
    if (this.infoForm.invalid) {
      return;
    }
  }

  onSocialFormSubmit() {
    if (this.socialForm.invalid) {
      return;
    }
  }

}
