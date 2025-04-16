import { Component, OnInit } from '@angular/core';
import { PfeService } from '../../../../services/pfe.service';
import { Pfe } from 'app/models/pfe';
import { PfeLevel } from 'app/models/pfe-level'; 
import { PfeStatus } from 'app/models/pfe-status';
import { CategoryEnum } from 'app/models/CategoryEnum';
import { formatDate } from '@angular/common';
import{ Document } from 'app/models/document';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {
  isEditMode: boolean = false;
  pfe: Pfe = {
    id: null,
    projectTitle: '',
    description: '',
    startDate: null,
    endDate: null,
    studentId: null,
    trainerId: null,
    entrepriseId: null,
    meetingLink: '',
    meetingNotes: '',
    meetingDate: null,
    level: PfeLevel.LICENCE,
    status: PfeStatus.EN_COURS,
    category: CategoryEnum.WEB_DEVELOPMENT,
    documents: [],       // Ajout des propriétés manquantes
    meetingDates: [],    // Ajout des propriétés manquantes
    juryNames: [],   
  };
  
  constructor(private pfeService: PfeService, 
    private route: ActivatedRoute) {}

  ngOnInit(): void {}

  // Fonction pour formater la date pour l'input HTML (format yyyy-MM-dd)
  formatDateForInput(date: Date): string {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : '';
  }

  // Fonction pour parser la date depuis l'input
  parseDateFromInput(dateString: string): Date | null {
    return dateString ? new Date(dateString) : null;
  }

  onSubmit() {
    // Validation des champs obligatoires
    if (!this.pfe.projectTitle || !this.pfe.studentId) {
      alert('Le titre du projet et l\'ID étudiant sont obligatoires');
      return;
    }
  
    // Formatage des dates pour le backend
    const pfeToSend = {
      ...this.pfe,
      startDate: this.formatDateForBackend(this.pfe.startDate),
      endDate: this.formatDateForBackend(this.pfe.endDate),
      meetingDate: this.formatDateForBackend(this.pfe.meetingDate)
    };
  
    console.log('Données envoyées:', pfeToSend); // Pour le débogage
  
    this.pfeService.createPfe(pfeToSend).subscribe({
      next: (response) => {
        console.log('PFE créé avec succès:', response);
        alert('PFE créé avec succès !');
        this.onReset();
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        if (error.error) {
          console.error('Message d\'erreur du serveur:', error.error);
        }
        alert(`Erreur lors de la création du PFE: ${error.message || 'Veuillez vérifier les données et réessayer'}`);
      }
    });
  }
  
  private formatDateForBackend(date: Date | null): string | null {
    if (!date) return null;
    return formatDate(date, 'dd-MM-yyyy', 'en-US');
  }

  onReset() {
    this.pfe = {
      id: null,
      projectTitle: '',
      description: '',
      startDate: null,
      endDate: null,
      studentId: null,
      trainerId: null,
      entrepriseId: null,
      meetingLink: '',
      meetingNotes: '',
      meetingDate: null,
      level: PfeLevel.LICENCE,
      status: PfeStatus.EN_COURS,
      category: CategoryEnum.WEB_DEVELOPMENT,
      documents: [],       // Réinitialisation des propriétés manquantes
      meetingDates: [],    // Réinitialisation des propriétés manquantes
      juryNames: [], 
            // Réinitialisation des propriétés manquantes
    };
  }
}