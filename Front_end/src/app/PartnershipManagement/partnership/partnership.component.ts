import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { Partnership } from '../models/partnership';
import { EntrepriseService } from '../services/entreprise.service';
import { PartnershipService } from '../services/partnership.service';
import { StorageService } from 'app/shared/auth/storage.service';

@Component({
  selector: 'app-partnership',
  templateUrl: './partnership.component.html',
  styleUrls: ['./partnership.component.scss']
})
export class PartnershipComponent implements OnInit {
  partnerships: Partnership[] = [];
  entrepriseMap: { [key: number]: string } = {}; // Map for quick lookup
  loading = false;
  error: string | null = null;
  deletingPartnerships: Set<number> = new Set(); // Track which partnerships are being deleted

  constructor(
    private partnershipService: PartnershipService,
    private entrepriseService: EntrepriseService, // Inject entreprise service
    private router: Router,
    private spinner: NgxSpinnerService,
    private storageService : StorageService
  ) {}

  ngOnInit(): void {
    this.fetchEntreprises();
    this.fetchPartnerships();
  }

  fetchPartnerships(): void {
  this.loading = true;
  this.spinner.show();

  const user = this.storageService.getUser();

  if (!user || !user.id) {
    this.error = 'No user found in session.';
    this.loading = false;
    this.spinner.hide();
    return;
  }

  console.log('User ID:', user.id); // Log the user ID

  this.partnershipService.getPartnershipsByPartnerId(user.id).subscribe({
    next: (data) => {
      console.log('Received partnerships:', data); // Log the received data
      this.partnerships = data;
      this.loading = false;
      this.spinner.hide();
    },
    error: (error) => {
      this.error = 'Error fetching partnerships';
      this.loading = false;
      this.spinner.hide();
      console.error(error);
    }
  });
}




  fetchEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe({
      next: (entreprises) => {
        this.entrepriseMap = entreprises.reduce((acc, entreprise) => {
          acc[entreprise.idEntreprise] = entreprise.nameEntreprise;
          return acc;
        }, {} as { [key: number]: string });
      },
      error: (error) => {
        this.error = 'Error fetching entreprises';
        console.error(error);
      }
    });
  }

  getEntrepriseName(entrepriseId: number): string {
    return this.entrepriseMap[entrepriseId] || 'Unknown Entreprise';
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/partnership/edit', id]);
  }

  deletePartnership(id: number): void {
    if (!confirm('Are you sure you want to delete this partnership?')) {
      return;
    }

    this.deletingPartnerships.add(id);

    this.partnershipService.deletePartnership(id).subscribe({
      next: () => {
        this.partnerships = this.partnerships.filter(p => p.idPartnership !== id);
        this.deletingPartnerships.delete(id);
      },
      error: (error) => {
        this.error = 'Error deleting partnership';
        this.deletingPartnerships.delete(id);
        console.error(error);
      }
    });
  }

  isDeleting(id: number): boolean {
    return this.deletingPartnerships.has(id);
  }
}
