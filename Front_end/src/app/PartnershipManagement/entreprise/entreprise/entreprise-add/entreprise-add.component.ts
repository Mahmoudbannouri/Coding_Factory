import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/models/User';
import { Entreprise } from 'app/PartnershipManagement/models/entreprise';
import { EntrepriseService } from 'app/PartnershipManagement/services/entreprise.service';
import { AuthService } from 'app/shared/auth/auth.service';


@Component({
  selector: 'app-entreprise-add',
  templateUrl: './entreprise-add.component.html',
  styleUrls: ['./entreprise-add.component.scss'],
})
export class EntrepriseAddComponent implements OnInit {
  entreprise: Entreprise = {
    nameEntreprise: '',
    addressEntreprise: '',
    phoneEntreprise: '',
    emailEntreprise: '',
    descriptionEntreprise: '',
    partnerId: 0,
  };

    partners: User[] = [];


  constructor(
    private entrepriseService: EntrepriseService,
    private router: Router,
    private authService : AuthService
  ) {}
  ngOnInit(): void {
   this.loadPartners();
  }

  loadPartners(): void {
    this.authService.getPartners().subscribe({
      next: (data) => this.partners = data,
      error: (err) => console.error('Failed to load partners', err)
    });
  }

  // Submit the form
  onSubmit(): void {
    this.entrepriseService.createEntreprise(this.entreprise).subscribe({
      next: () => {
        console.log('Entreprise created successfully');
        this.router.navigate(['/entreprise']); // Navigate back to the list
      },
      error: (error) => {
        console.error('Error creating entreprise:', error);
      },
    });
  }

  // Cancel and navigate back to the list
  onCancel(): void {
    this.router.navigate(['/entreprise']);
  }
}