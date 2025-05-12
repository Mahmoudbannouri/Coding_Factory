import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcceptanceStatus } from 'app/PartnershipManagement/models/AcceptanceStatus';
import { Assessment } from 'app/PartnershipManagement/models/assessment.model';
import { Partnership } from 'app/PartnershipManagement/models/partnership';
import { Status } from 'app/PartnershipManagement/models/Status';
import { AgreementsService } from 'app/PartnershipManagement/services/agreements.service';
import { PartnershipService } from 'app/PartnershipManagement/services/partnership.service';
import { StorageService } from 'app/shared/auth/storage.service';


@Component({
  selector: 'app-partnership-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partnership-details.component.html',
  styleUrls: ['./partnership-details.component.scss'],
})
export class PartnershipDetailsComponent implements OnInit {
  partnership: Partnership | undefined; // Marked as possibly undefined
  assessments: Assessment[] = [];
  id!: number;
  showAdd = false;
  newFeedback: string = '';

  adminButtonDisabled: boolean = false;
  partnerButtonDisabled: boolean = false;

  isAdminLoggedIn: boolean = false;
  isPartnerLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private partnershipService: PartnershipService,
    private agreementService: AgreementsService,
    private storageService: StorageService

  ) {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
    } else {
      console.error('ID parameter not found in the route');
    }
  }

  ngOnInit(): void {
    this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
    this.isPartnerLoggedIn = StorageService.isPartnerLoggedIn();

    console.log('Is Admin Logged In:', this.isAdminLoggedIn);
    console.log('Is Partner Logged In:', this.isPartnerLoggedIn);

    if (this.id) {
      this.loadPartnershipDetails();
      this.loadAssessments();
    }
  }

  loadPartnershipDetails(): void {
    this.partnershipService.getPartnershipById(this.id).subscribe(
      (data) => {
        this.partnership = data;
        this.assessments = data?.Assesements ?? []; // Ensures it's an empty array if undefined
      },
      (error) => {
        console.error('Error loading partnership details', error);
      }
    );
  }

  loadAssessments(): void {
    this.agreementService.getAssessmentsByPartnershipId(this.id).subscribe({
      next: (data) => {
        this.assessments = [...data]; // Replace with new array to trigger UI update
      },
      error: (err) => {
        console.error('Error loading assessments:', err);
      }
    });
  }
  

  saveAgreement(): void {
    const trimmedFeedback = this.newFeedback.trim();
    if (!trimmedFeedback) {
      alert('Agreement cannot be empty.');
      return;
    }

    if (!this.partnership) {
      alert('Partnership not found!');
      return;
    }

    const newAssessment: Assessment = {
      idAssessment: 0,
      score: 0,
      feedback: trimmedFeedback,
      status: Status.Pending,
      acceptanceStatus: AcceptanceStatus.Pending,
      adminAcceptance: false,
      partnerAcceptance: false,
      partnership: this.partnership // Now TypeScript will be sure it's defined
    };

    this.agreementService.createAssessment(newAssessment, this.partnership.idPartnership).subscribe(
      (createdAssessment) => {
        this.assessments.push(createdAssessment);
        this.newFeedback = '';
        this.showAdd = false;
      },
      (error) => {
        console.error('Error saving agreement:', error);
        if (error.error && error.error.message) {
          alert(error.error.message); // Display any error message sent from the backend
        }
      }
    );
  }

  deleteAssessment(id: number): void {
    if (!confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    this.agreementService.deleteAssessment(id).subscribe({
      next: () => {
        // Remove from local list
        this.assessments = this.assessments.filter(a => a.idAssessment !== id);
        console.log(`Assessment with ID ${id} deleted.`);
      },
      error: err => {
        console.error('Error deleting assessment:', err);
        alert('Failed to delete the assessment. Please try again.');
      }
    });
  }

  downloadPDF(): void {
    if (!this.partnership) {
      console.error('Partnership not available for download.');
      return;
    }

    this.partnershipService.generatePartnershipPdf(this.id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = `partnership-details-${this.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error generating PDF', error);
      }
    );
  }

  // Admin and partner decision logic
  onAdminDecision(id: number, status: 'Accept' | 'Reject') {
    this.adminButtonDisabled = true; // Disable admin buttons
    this.agreementService.updateStatusAdmin(id, status).subscribe({
      next: res => {
        console.log('Admin status updated:', res);
        this.loadAssessments(); // Refresh assessments after update
      },
      error: err => {
        console.error('Error updating admin status:', err);
        this.adminButtonDisabled = false; // Re-enable admin buttons on error
      },
      complete: () => {
        this.adminButtonDisabled = false; // Re-enable admin buttons on completion
      }
    });
  }

 onPartnerDecision(id: number, status: 'Accept' | 'Reject') {
  this.partnerButtonDisabled = true; // Disable partner buttons
  this.agreementService.updateStatusPartner(id, status).subscribe({
    next: res => {
      console.log('Partner status updated:', res);
      this.loadAssessments(); // Refresh assessments after update
    },
    error: err => {
      console.error('Error updating partner status:', err);
      alert(typeof err === 'string' ? err : 'Failed to update status');
      this.partnerButtonDisabled = false; // Re-enable partner buttons on error
    },
    complete: () => {
      this.partnerButtonDisabled = false; // Re-enable partner buttons on completion
    }
  });
}

  
  getAcceptanceStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  markAsCompleted(id: number) {
    this.agreementService.markAsCompleted(id).subscribe({
      next: (updatedAssessment) => {
        const index = this.assessments.findIndex(a => a.idAssessment === id);
        if (index !== -1) {
          this.assessments[index].status = updatedAssessment.status;
          this.assessments[index].score = updatedAssessment.score;
          this.loadAssessments(); // Refresh assessments after update
          this.loadPartnershipDetails();

        }
      },
      error: (error) => {
        console.error('Error updating assessment:', error);
      }
    });
  }
  partnerId = 123; // Example partner ID (you should replace this with dynamic value)
  accessToken: string = 'eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImFhYWI5YTdmLTBjZDQtNDJlZi04OWU4LTM2NmE2MjExZjMwZCJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJSaW5BY0tnM1N1MmoyNGJ3RU1mLXh3IiwidmVyIjoxMCwiYXVpZCI6IjUyNDRiMjc0Y2Y0ZjhkODEwYzk2Nzg3NzViNTliYjgwMWI3ODFmOWQ2YjU4YzY3N2YxZjQxODZiODI0OTFhZjYiLCJuYmYiOjE3NDQyMDUwMzYsImNvZGUiOiJEeTc3aExFRDdPUWZPdjBNUl9RUmEyYnpPbVBXVmdOSGciLCJpc3MiOiJ6bTpjaWQ6b2dDOWdzbzFSSXl4bzJFZ2dydDRhUSIsImdubyI6MCwiZXhwIjoxNzQ0MjA4NjM2LCJ0eXBlIjowLCJpYXQiOjE3NDQyMDUwMzYsImFpZCI6Il9EZWhDM05BVEJXZDQwcVJ1NlRhaHcifQ.DMeGKg-cqbyrog3Xj97s73hTlJBdZL_DgpShlOQMJM4-6mU9-emnz63s20EtkSFYiXlx9Mt8-VTDgZtmMox04g'; // Add the Zoom access token here manually
  // Method to book a Zoom meeting for a partnership
bookMeeting(partnershipId: number): void {
  if (!this.accessToken) {
    console.error('Zoom access token is missing');
    return;
  }

  const topic = `Meeting for Partnership #${partnershipId}`;
  const startTime = new Date().toISOString(); // Use current time as example
  const duration = 30; // Example: 30 minutes duration
  const recipientEmail = 'partner@example.com'; // Replace with actual recipient email

  // Calling the PartnershipService to create the Zoom meeting
  this.partnershipService.createMeeting(topic, startTime, duration, this.accessToken, recipientEmail).subscribe({
    next: (meetingUrl) => {
      console.log('Zoom meeting created:', meetingUrl);
      alert(`Zoom meeting created! Join here: ${meetingUrl}`);
    },
    error: (err) => {
      console.error(err);
    }
  });
}

}
