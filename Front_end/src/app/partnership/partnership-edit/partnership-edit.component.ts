import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipService } from '../../services/partnership.service';
import { Partnership } from '../../models/partnership';
import { EntrepriseService } from '../../services/entreprise.service';
import { ProposalService } from '../../services/proposal.service';
import { Entreprise } from '../../models/entreprise';
import { Proposal } from '../../models/proposal';

@Component({
  selector: 'app-partnership-edit',
  templateUrl: './partnership-edit.component.html',
  styleUrls: ['./partnership-edit.component.scss']
})
export class PartnershipEditComponent implements OnInit {
  partnership: Partnership = {
    partnershipStatus: '',
    entreprise: null,
    proposals: null
  };
  partnershipId: number | null = null;
  entreprises: Entreprise[] = [];
  proposals: Proposal[] = [];

  constructor(
    private partnershipService: PartnershipService,
    private entrepriseService: EntrepriseService,
    private proposalService: ProposalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.partnershipId = +this.route.snapshot.paramMap.get('id')!;
    if (this.partnershipId) {
      this.fetchPartnership(this.partnershipId);
    }

    this.fetchEntreprises();
    this.fetchProposals();
  }

  fetchPartnership(id: number): void {
    this.partnershipService.getPartnership(id).subscribe({
      next: (data) => {
        this.partnership = data;
      },
      error: (error) => {
        console.error('Error fetching partnership:', error);
      }
    });
  }

  fetchEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe({
      next: (data) => (this.entreprises = data),
      error: (error) => console.error('Error fetching entreprises:', error)
    });
  }

  fetchProposals(): void {
    this.proposalService.getProposals().subscribe({
      next: (data) => (this.proposals = data),
      error: (error) => console.error('Error fetching proposals:', error)
    });
  }

  savePartnership(): void {
    if (this.partnershipId) {
      this.partnershipService.updatePartnership(this.partnershipId, this.partnership).subscribe({
        next: () => this.router.navigate(['/datatables']),
        error: (error) => console.error('Error updating partnership:', error)
      });
    } else {
      this.partnershipService.createPartnership(this.partnership).subscribe({
        next: () => this.router.navigate(['/datatables']),
        error: (error) => console.error('Error creating partnership:', error)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/datatables']);
  }
}
