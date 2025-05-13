import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProposalService } from '../services/proposal.service';
import { Proposal } from '../models/proposal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private proposalService: ProposalService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  
  
  
    
  
  


  ngOnInit(): void {
    this.fetchProposals();
  }

  fetchProposals(): void {
    this.loading = true;
    this.spinner.show();
  
    this.proposalService.getProposals().subscribe({
      next: (data) => {
        this.proposals = data;
        this.loading = false;
        this.spinner.hide();
        this.proposalsCount = this.proposals.length; // Update proposal count

        // Show success notification when proposals are successfully fetched
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
        
        // Show error notification if fetching proposals fails
        this.toastr.error('Failed to load proposals!', 'Error', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
        });
      }
    });
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
      },
      error: () => {
        this.error = 'Error deleting proposal';
        this.deletingProposals.delete(id);
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
