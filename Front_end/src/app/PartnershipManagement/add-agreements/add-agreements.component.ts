// add-agreements.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgreementService } from '../agreements.service';
import { agreement } from '../models/agreement';

@Component({
  selector: 'app-add-agreements',
  templateUrl: './add-agreements.component.html',  // This should match the filename
  styleUrls: ['./add-agreements.component.scss']
})
export class AddAgreementsComponent implements OnInit {
  assessments: agreement[] = [];
  partnershipId: number;

  constructor(
    private agreementsservice: AgreementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the partnershipId from the route parameters
    this.partnershipId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch assessments related to this partnership
    this.getAssessments();
  }

  getAssessments(): void {
    this.agreementsservice.getAssessmentsByPartnership(this.partnershipId).subscribe(
      (response) => {
        console.log('Assessments fetched:', response);
        this.assessments = response;
      },
      (error) => {
        console.error('Error fetching assessments:', error);
      }
    );
  }
}
