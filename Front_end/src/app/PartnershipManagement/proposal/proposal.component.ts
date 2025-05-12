import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProposalService } from '../services/proposal.service';
import { Proposal } from '../models/proposal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'app/shared/auth/storage.service';
import { EntrepriseService } from '../services/entreprise.service';
import { PartnershipService } from '../services/partnership.service';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {
  
  proposals: Proposal[] = [];
  loading = false;
  error: string | null = null;
  deletingProposals: Set<number> = new Set();
  isModalOpen = false;
  selectedProposal: Proposal | null = null;
  proposalsCount: number = 0; // Proposal count to be passed to the chart
  isAdminLoggedIn: boolean = false;
  isPartnerLoggedIn: boolean = false;
  entrepriseId: number | null = null;



  constructor(
    private proposalService: ProposalService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private storageService : StorageService,
    private entrepriseService : EntrepriseService,
    private partnershipService : PartnershipService
  ) {}
  
  ngOnInit(): void {
    this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
    this.isPartnerLoggedIn = StorageService.isPartnerLoggedIn();

     console.log('Is Admin Logged In:', this.isAdminLoggedIn);
    console.log('Is Partner Logged In:', this.isPartnerLoggedIn);
    
    this.fetchProposals();

      if (this.isPartnerLoggedIn) {
    const user = this.storageService.getUser();
    if (user && user.id) {
      this.fetchEntrepriseIdByPartnerId(user.id);
    }
  }
  }

    fetchProposals(): void {
    this.loading = true;
    this.spinner.show();

    this.proposalService.getProposals().subscribe({
      next: (data) => {
        this.proposals = data;
        this.loading = false;
        this.spinner.hide();
        this.proposalsCount = this.proposals.length;

        this.toastr.success('Proposals loaded successfully!', 'Success', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
        });
      },
      error: (error) => {
        this.error = 'Error fetching proposals';
        this.loading = false;
        this.spinner.hide();

        this.toastr.error('Failed to load proposals!', 'Error', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
        });
      }
    });
  }

  fetchEntrepriseIdByPartnerId(partnerId: number): void {
    this.entrepriseService.getEntrepriseIdByPartnerId(partnerId).subscribe({
      next: (data) => {
        this.entrepriseId = data;
      },
      error: (error) => {
        console.error('Error fetching entreprise ID:', error);
      }
    });
  }
   applyForPartnership(proposalId: number): void {
  if (this.entrepriseId !== null) {
    this.partnershipService.applyForPartnership(this.entrepriseId, proposalId).subscribe({
      next: (data) => {
        // Success alert
        this.toastr.success('Application sent successfully!', 'Success', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
        });
      },
      error: (error) => {
        // Handle different error messages
        if (error.status === 400 && error.error && error.error.message) {
          if (error.error.message.includes("fulfilled")) {
            // Alert for fulfilled proposal
            this.toastr.error('Application fulfilled, cannot apply!', 'Error', {
              positionClass: 'toast-top-right',
              timeOut: 3000,
              progressBar: true,
            });
          } else {
            // Generic error alert
            this.toastr.error('Failed to apply for partnership: ' + error.error.message, 'Error', {
              positionClass: 'toast-top-right',
              timeOut: 3000,
              progressBar: true,
            });
          }
        } else {
          // Generic error alert
          this.toastr.error('Failed to apply for partnership!', 'Error', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true,
          });
        }
      }
    });
  } else {
    this.toastr.error('Entreprise ID not found!', 'Error', {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    });
  }
}


  selectProposal(proposal: Proposal): void {
    this.selectedProposal = proposal;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProposal = null;
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/proposal/edit', id]);
  }

  deleteProposal(id: number): void {
    if (!confirm('Are you sure you want to delete this proposal?')) {
      return;
    }

    this.deletingProposals.add(id);

    this.proposalService.deleteProposal(id).subscribe({
      next: () => {
        this.proposals = this.proposals.filter(p => p.idProposal !== id);
        this.deletingProposals.delete(id);
        this.toastr.success('Proposal deleted successfully!', 'Success', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
        });
      },
      error: () => {
        this.error = 'Error deleting proposal';
        this.deletingProposals.delete(id);
        this.toastr.error('Failed to delete proposal!', 'Error', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
        });
      }
    });
  }

  deleteExpiredProposals(): void {
    this.fetchProposals(); // Simply reload the list
  }

  navigateToAdd(): void {
    this.router.navigate(['/proposal/add']);
  }

  isDeleting(id: number): boolean {
    return this.deletingProposals.has(id);
  }
}
