import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Entreprise } from 'app/models/entreprise';
import { EntrepriseService } from 'app/services/entreprise.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss'],
})
export class EntrepriseComponent implements OnInit {
  entreprises: Entreprise[] = [];
  loading = false;
  error: string | null = null;
  deletingId: number | null = null;
  editingId: number | null = null; // Track the ID of the entreprise being edited
  editForm: FormGroup;

  constructor(
    private entrepriseService: EntrepriseService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      idEntreprise: [null], // Store entreprise ID
      nameEntreprise: ['', Validators.required],
      addressEntreprise: ['', Validators.required],
      phoneEntreprise: ['', Validators.required],
      emailEntreprise: ['', [Validators.required, Validators.email]],
      descriptionEntreprise: [''],
    });

    this.fetchEntreprises();
   // this.fetchUsers();
  }

  

  fetchEntreprises(): void {
    this.loading = true;
    this.spinner.show();
    this.entrepriseService.getEntreprises().subscribe({
      next: (data) => {
        this.entreprises = data;
        this.loading = false;
        this.spinner.hide();
      },
      error: () => {
        this.error = 'Error fetching entreprises';
        this.loading = false;
        this.spinner.hide();
      },
    });
  }
  assignEntrepriseToUser(entreprise: Entreprise, userId: number): void {
    this.entrepriseService.assignEntrepriseToUser(entreprise.idEntreprise, userId).subscribe({
      next: () => {
        console.log('Entreprise assigned successfully');
        // You could also update the entreprise list or show a success message
        this.fetchEntreprises();
      },
      error: (err) => {
        console.error('Error assigning entreprise:', err);
        this.error = 'Error assigning entreprise';
      },
    });
  }

  deleteEntreprise(id: number): void {
    if (!confirm('Are you sure you want to delete this entreprise?')) {
      return;
    }

    this.deletingId = id;
    this.entrepriseService.deleteEntreprise(id).subscribe({
      next: () => {
        this.entreprises = this.entreprises.filter((e) => e.idEntreprise !== id);
        this.deletingId = null;
      },
      error: () => {
        this.error = 'Error deleting entreprise';
        this.deletingId = null;
      },
    });
  }

  editEntreprise(entreprise: Entreprise): void {
    console.log('Editing entreprise:', entreprise); // Debugging log
    this.editingId = entreprise.idEntreprise; // Set the editing ID
    this.editForm.patchValue(entreprise); // Populate the form with entreprise details
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    this.loading = true;
    this.spinner.show();

    const updatedEntreprise: Entreprise = { ...this.editForm.value };

    this.entrepriseService.updateEntreprise(updatedEntreprise).subscribe({
      next: () => {
        this.loading = false;
        this.spinner.hide();
        this.fetchEntreprises();
        this.editingId = null; // Reset edit mode after update
      },
      error: () => {
        this.error = 'Error updating entreprise';
        this.loading = false;
        this.spinner.hide();
      },
    });
  }

  cancelEditMode(): void {
    this.editingId = null;
    this.editForm.reset(); // Reset form fields
  }

  navigateToAdd(): void {
    this.router.navigate(['/entreprise/add']);
  }
}
