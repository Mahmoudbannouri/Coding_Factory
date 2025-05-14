import { CategoryEnum } from './CategoryEnum';
import { PfeLevel } from './pfe-level';
import { PfeStatus } from './pfe-status';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UsersListComponent } from 'app/pages/full-pages/users/users-list/users-list.component';

@NgModule({
 
  imports: [
    CommonModule,
    NgxDatatableModule,
    // ... autres modules nécessaires
  ]
})

export class Pfe {

    id!: number; // Identifiant unique du PFE
    projectTitle!: string; // Titre du projet
    description!: string; // Description du projet
    startDate!: Date; // Date de début
    endDate!: Date; // Date de fin
    studentId?: number[]; // Uncomment and add this property
    trainerId?: number [];
    partnerId?: number [];
    meetingLink!: string; // Lien pour la réunion
    meetingNotes!: string; // Notes de la réunion
    meetingDate!: Date; // Date de la réunion
    level!: PfeLevel; // Niveau du PFE (Licence, Master, Ingénieur)
    status!: PfeStatus; // Statut du PFE (En cours, Validé, Refusé)
    category!: CategoryEnum // Catégorie du PFE
   documents!: string[]; // Liste des documents associés
    meetingDates!: Date[]; // Liste des dates des réunions
    juryNames!: string[]; 
    
}



