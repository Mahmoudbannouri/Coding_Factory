import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-performance-prediction',
  templateUrl: './performance-prediction.component.html',
  styleUrls: ['./performance-prediction.component.scss']
})
export class PerformancePredictionComponent {
  studentForm: FormGroup;
  predictionResult: number | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.studentForm = this.fb.group({
      age: [18, [Validators.required, Validators.min(15), Validators.max(22)]],
      school: ['GP', Validators.required],
      sex: ['F', Validators.required],
      address: ['U', Validators.required],
      famsize: ['GT3', Validators.required],
      Pstatus: ['A', Validators.required],
      Medu: [4, [Validators.required, Validators.min(0), Validators.max(4)]],
      Fedu: [4, [Validators.required, Validators.min(0), Validators.max(4)]],
      Mjob: ['at_home', Validators.required],
      Fjob: ['teacher', Validators.required],
      reason: ['course', Validators.required],
      guardian: ['mother', Validators.required],
      traveltime: [2, [Validators.required, Validators.min(1), Validators.max(4)]],
      studytime: [2, [Validators.required, Validators.min(1), Validators.max(4)]],
      failures: [0, [Validators.required, Validators.min(0), Validators.max(4)]],
      schoolsup: ['yes', Validators.required],
      famsup: ['no', Validators.required],
      paid: ['no', Validators.required],
      activities: ['no', Validators.required],
      nursery: ['yes', Validators.required],
      higher: ['yes', Validators.required],
      internet: ['no', Validators.required],
      romantic: ['no', Validators.required],
      famrel: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      freetime: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      goout: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      Dalc: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      Walc: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      health: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      absences: [4, [Validators.required, Validators.min(0)]],
      G1: [15.5, [Validators.required, Validators.min(0), Validators.max(20)]],
      G2: [16.0, [Validators.required, Validators.min(0), Validators.max(20)]]
    });
  }

  ngOnInit(): void {
    // You can add any initialization logic here
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.isLoading = true;
      this.predictionResult = null;
      
      const formData = this.studentForm.value;
      
      // Convert numeric fields from string to number
      const numericFields = ['age', 'Medu', 'Fedu', 'traveltime', 'studytime', 'failures', 
                            'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 
                            'absences', 'G1', 'G2'];
      
      numericFields.forEach(field => {
        formData[field] = Number(formData[field]);
      });

      this.http.post(`${environment.apiBaseUrl}/api/predict`, formData)
        .subscribe(
          (response: any) => {
            this.predictionResult = response.prediction; // Adjust based on your API response
            this.isLoading = false;
          },
          (error) => {
            console.error('Error making prediction:', error);
            this.isLoading = false;
            // Handle error (show message to user)
          }
        );
    }
  }

  resetForm(): void {
    this.studentForm.reset({
      age: 18,
      school: 'GP',
      sex: 'F',
      address: 'U',
      famsize: 'GT3',
      Pstatus: 'A',
      Medu: 4,
      Fedu: 4,
      Mjob: 'at_home',
      Fjob: 'teacher',
      reason: 'course',
      guardian: 'mother',
      traveltime: 2,
      studytime: 2,
      failures: 0,
      schoolsup: 'yes',
      famsup: 'no',
      paid: 'no',
      activities: 'no',
      nursery: 'yes',
      higher: 'yes',
      internet: 'no',
      romantic: 'no',
      famrel: 4,
      freetime: 3,
      goout: 4,
      Dalc: 1,
      Walc: 1,
      health: 3,
      absences: 4,
      G1: 15.5,
      G2: 16.0
    });
    this.predictionResult = null;
  }
}