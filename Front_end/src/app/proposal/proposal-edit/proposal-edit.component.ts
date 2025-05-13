import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from '../../services/proposal.service';
import { Proposal } from '../../models/proposal';

@Component({
  selector: 'app-proposal-edit',
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.scss']
})
export class ProposalEditComponent implements OnInit {
  proposal: Proposal = {
    proposalName: '',
    proposalDescription: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    plannedAmount: 0,
    proposalStatus: '',
    proposalType: '',
  };
  loading = false;
  error: string | null = null;
  isEditMode = false;

  // New field for agreement input
  newAgreement: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proposalService: ProposalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadProposal(+id);
    }
  }

  loadProposal(id: number): void {
    this.loading = true;
    this.proposalService.getProposal(id).subscribe({
      next: (data) => {
        if (data.startDate) {
          data.startDate = new Date(data.startDate).toISOString().split('T')[0];
        }
        if (data.endDate) {
          data.endDate = new Date(data.endDate).toISOString().split('T')[0];
        }
        // Ensure agreements is always an array
        this.proposal = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading proposal: ' + error;
        this.loading = false;
        console.error('Load error:', error);
      }
    });
  }

  // Add new agreement to the list
  

  // Remove agreement from the list
  
  onSubmit(): void {
    this.loading = true;
    this.error = null;

    // Create a copy of the proposal for sending to the API
    const proposalToSend = {
      ...this.proposal,
      startDate: new Date(this.proposal.startDate as string),
      endDate: new Date(this.proposal.endDate as string),
      // Ensure agreements is sent as an array
    };

    console.log('Submitting proposal:', proposalToSend);

    const observable = this.isEditMode ?
      this.proposalService.updateProposal(proposalToSend) :
      this.proposalService.createProposal(proposalToSend);

    observable.subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.router.navigate(['/proposal']);
      },
      error: (error) => {
        this.error = `Error ${this.isEditMode ? 'updating' : 'creating'} proposal: ` + error;
        this.loading = false;
        console.error('Submit error:', error);
      }
    });
  }
}
