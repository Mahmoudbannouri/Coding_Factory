import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Entreprise } from 'app/models/entreprise';
import { EntrepriseService } from 'app/services/entreprise.service';

@Component({
  selector: 'app-entreprise-add',
  templateUrl: './entreprise-add.component.html',
  styleUrls: ['./entreprise-add.component.scss'],
})
export class EntrepriseAddComponent {
  entreprise: Entreprise = {
    nameEntreprise: '',
    addressEntreprise: '',
    phoneEntreprise: '',
    emailEntreprise: '',
    descriptionEntreprise: '',
  };
  userId: number;


  constructor(
    private entrepriseService: EntrepriseService,
    private router: Router
  ) {}

  // Submit the form
  onSubmit(): void {
    if (!this.userId || !this.entreprise.nameEntreprise) {
      alert('Please fill all required fields including the User ID.');
      return;
    }
  
    this.entrepriseService.addEntrepriseAndAssignToUser(this.entreprise, this.userId).subscribe({
      next: () => {
        console.log('Entreprise created and assigned successfully');
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