
import { Component, OnInit } from '@angular/core';
import { Pfe } from 'app/models/pfe';
import { PfeService } from '../../../../services/pfe.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import{Document} from  'app/models/document';
import{Meeting} from 'app/models/meetingDates';
import{Jury} from 'app/models/juryNames';
import { HttpErrorResponse } from '@angular/common/http';




@Component({
  selector: 'app-users-view',
  templateUrl: './Users-view.component.html',
  styleUrls: ['./Users-view.component.scss', '../../../../../assets/sass/pages/page-users.scss']
})
export class UsersViewComponent implements OnInit {
  pfe: Pfe = new Pfe();
  errorMessage: string = '';
  isLoading: boolean = true;
  error: string;

  constructor(
    private pfeService: PfeService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  
  /*ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPfe(+id); // Le + convertit la string en number
    } else {
      this.error = "Aucun ID de projet spécifié";
      this.isLoading = false;
    }
  }

  loadPfe(id: number): void {
    this.isLoading = true;
    this.pfeService.getPfeById(id).subscribe({
      next: (pfe) => {
        this.pfe = pfe;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement du projet";
        this.isLoading = false;
        console.error(err);
      }
    });
  }*/

 ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = "Aucun ID fourni dans l'URL";
      this.isLoading = false;
      return;
    }
    const id = parseInt(idParam, 10);
    
    if (isNaN(id)) {
      this.errorMessage = `ID invalide: ${idParam}`;
      this.isLoading = false;
      return;
    }

    this.loadPfe(id);
  }

  loadPfe(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pfeService.getPfeById(id).subscribe({
      next: (pfe: Pfe) => {
        this.pfe = pfe;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        
        if (error.status === 400) {
          this.errorMessage = 'Requête invalide. ID non reconnu.';
        } else if (error.status === 404) {
          this.errorMessage = 'Aucun PFE trouvé avec cet ID.';
        } else {
          this.errorMessage = 'Erreur lors du chargement du PFE.';
        }
        
        console.error('Erreur détaillée:', {
          URL: error.url,
          Status: error.status,
          Message: error.message,
          Réponse: error.error
        });
      }
    });
  
  }

  addDocument(): void {
    const modalRef = this.modalService.open(Document);
    modalRef.componentInstance.pfeId = this.pfe.id;
    modalRef.result.then((result) => {
      if (result) {
        this.uploadDocument(result.file, result.name);
      }
    }).catch(() => {});
  }

  uploadDocument(file: File, fileName: string): void {
    const formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('pfeId', this.pfe.id.toString());
  
    this.pfeService.uploadDocument(formData).subscribe(
      (_response) => {
        // Mettre à jour la liste des documents
        this.loadPfe(this.pfe.id);
      },
      (error) => {
        console.error('Erreur lors du téléchargement:', error);
      }
    );
  }
  downloadDocument(docId: number): void {
    this.pfeService.downloadDocument(docId).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${docId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement:', error);
      }
    );
  }

  removeDocument(docUrl: string): void {
    if (confirm('Are you sure you want to remove this document?')) {
      this.pfeService.removeDocument(this.pfe.id, docUrl).subscribe(
        () => {
          this.loadPfe(this.pfe.id);
        },
        (error) => {
          console.error('Error removing document:', error);
        }
      );
    }
  }

  scheduleMeeting(): void {
    const modalRef = this.modalService.open(Meeting);
    modalRef.componentInstance.pfeId = this.pfe.id;
    modalRef.result.then((result) => {
      if (result) {
        this.loadPfe(this.pfe.id);
      }
    }).catch(() => {});
  }

 /* removeMeetingDate(meetingDate: Date): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
      this.pfeService.removeMeetingDate(this.pfe.id, meetingDate).subscribe({
        next: (updatedPfe) => {
          // Mettre à jour l'objet 'pfe' avec les nouvelles données (après suppression)
          this.pfe = updatedPfe;
          alert('Réunion supprimée avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Échec de la suppression: ' + err.message);
        }
      });
    }
  }*/
  
  removeMeetingDate(meetingDate: Date): void {
    if (confirm('Are you sure you want to remove this meeting?')) {
      this.pfeService.removeMeetingDate(this.pfe.id, meetingDate).subscribe(
        () => {
          this.loadPfe(this.pfe.id);
        },
        (error) => {
          console.error('Error removing meeting:', error);
        } );}}

 removeJuryMember(juryName: string): void {
    if (confirm('Are you sure you want to remove this jury member?')) {
      this.pfeService.removeJuryMember(this.pfe.id, juryName).subscribe(
        () => {
          this.loadPfe(this.pfe.id);
        },
        (error) => {
          console.error('Error removing jury member:', error);
        }
      );
    }
  }
  addJuryMember(): void {
    const modalRef = this.modalService.open(Jury);
    modalRef.componentInstance.pfeId = this.pfe.id;
    modalRef.result.then((result) => {
      if (result) {
        this.loadPfe(this.pfe.id);
      }
    }).catch(() => {});
  }

 
}