
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
  selector: 'app-pfe-view',
  templateUrl: './pfe-view.component.html',
  styleUrls: ['./pfe-view.component.scss', '../../../../../assets/sass/pages/page-users.scss']
})
export class PfeViewComponent implements OnInit {
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
      console.log('PFE data received:', pfe); // Vérifiez cette sortie
      this.pfe = pfe;
      this.isLoading = false;
    },
    error: (error: HttpErrorResponse) => {
      console.error('Error loading PFE:', error);
      this.isLoading = false;
      this.errorMessage = 'Failed to load PFE data';
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
    this.isLoading = true;
    this.errorMessage = '';
    
    const formData = new FormData();
    formData.append('file', file, fileName);

    this.pfeService.uploadDocument(this.pfe.id, formData).subscribe({
      next: () => {
        this.loadPfe(this.pfe.id);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de l\'upload du document';
        console.error('Erreur upload document:', error);
      }
    });
  }
 downloadDocument(docUrl: string): void {
  // Extraire le nom du fichier de l'URL
  const fileName = docUrl.split('/').pop() || `document-${new Date().getTime()}`;
  
  // Créer un lien temporaire pour le téléchargement
  const link = document.createElement('a');
  link.href = docUrl;
  link.download = fileName;
  link.target = '_blank';
  
  // Déclencher le téléchargement
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

 removeDocument(docUrl: string): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    this.isLoading = true;
    
    // Extraire uniquement le nom du fichier de l'URL
    const docName = this.extractFilename(docUrl);
    
    this.pfeService.removeDocument(this.pfe.id, docName).subscribe({
      next: (updatedPfe) => {
        // Mettre à jour l'objet pfe complet avec la réponse du serveur
        this.pfe = updatedPfe;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Échec de la suppression du document');
        this.isLoading = false;
      }
    });
  }
}
// Fonction pour extraire le nom de fichier
extractFilename(url: string): string {
  if (!url) return 'Document sans nom';
  return url.split('/').pop().split('?')[0];
}

// Fonction pour déterminer le type de fichier
getFileType(doc: any): string {
  const url = doc.url || doc;
  if (!url) return 'AUTRE';
  
  const extension = url.split('.').pop().toLowerCase();
  
  if (['pdf'].includes(extension)) return 'PDF';
  if (['doc', 'docx'].includes(extension)) return 'DOC';
  if (['xls', 'xlsx', 'csv'].includes(extension)) return 'XLS';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'IMG';
  
  return 'AUTRE';
}

// Fonction pour formater la taille du fichier
getFileSize(bytes: number): string {
  if (!bytes) return 'N/A';
  
  const sizes = ['o', 'Ko', 'Mo', 'Go'];
  if (bytes === 0) return '0 o';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

// Nouvelle fonction pour l'aperçu
previewDocument(doc: any): void {
  const url = doc.url || doc;
  window.open(url, '_blank');
}

// Fonction pour ouvrir le dialogue d'upload
openUploadDialog(): void {
  // Implémentez votre logique d'upload ici
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = (event) => this.handleFileInput(event);
  fileInput.click();
}

handleFileInput(event: any): void {
  const file = event.target.files[0];
  if (file) {
    // Implémentez votre logique d'upload ici
    console.log('Fichier sélectionné:', file);
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