import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { PfeService } from '../../../services/pfe.service';
import { Observable } from 'rxjs';
import { Pfe } from 'app/models/pfe';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Input() pfeId: number | null = null;
  documents$: Observable<string[]>;
  selectedPfeId: number | null = null;
    selectedPfe: Pfe | null = null;
    pfes: Pfe[] = [];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;

  constructor(private pfeService: PfeService) {}

  ngOnInit(): void {
    this.initializeUploader();
    this.loadDocuments();
     this.loadPfes();
  }
 loadPfes(): void {
    this.pfeService.getAllPfe().subscribe(
      (pfes) => {
        this.pfes = pfes;
      },
      (error) => {
        console.error('Erreur lors du chargement des PFEs:', error);
      }
    );
  }
  
  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: `${this.pfeService.apiUrl}/${this.pfeId}/documents`,
      isHTML5: true,
      autoUpload: false,
      removeAfterUpload: true,
      headers: [{ name: 'Accept', value: 'application/json' }]
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }

  loadDocuments(): void {
    this.documents$ = this.pfeService.getDocuments(this.pfeId);
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  downloadItem(item: FileItem): void {
    const url = URL.createObjectURL(item._file);
    const a = document.createElement('a');
    a.href = url;
    a.download = item._file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadAll(): void {
    this.uploader.queue.forEach(item => {
      this.downloadItem(item);
    });
  }

  downloadDocument(docId: number): void {
    this.pfeService.downloadDocument(docId).subscribe(
      (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${docId}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error => {
        console.error('Erreur de téléchargement:', error);
        alert('Impossible de télécharger le document');
      }
    );
  }

  addDocument(documentUrl: string): void {
    if (!documentUrl) return;
    
    this.pfeService.addDocument(this.pfeId, documentUrl).subscribe(
      () => this.loadDocuments(),
      error => {
        console.error('Erreur lors de l\'ajout du document:', error);
        alert('Erreur lors de l\'ajout du document');
      }
    );
  }

  removeDocument(documentName: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      this.pfeService.removeDocument(this.pfeId, documentName).subscribe(
        () => this.loadDocuments(),
        error => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du document');
        }
      );
    }
  }

 uploadFile(fileItem: FileItem): void {
  const formData = new FormData();
  formData.append('file', fileItem._file, fileItem._file.name);

  this.pfeService.uploadDocument(this.pfeId, formData).subscribe(
    () => {
      this.loadDocuments();
      fileItem.remove();
    },
    error => {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'envoi du fichier');
    }
  );
}

  uploadAll(): void {
  this.uploader.queue.forEach(item => {
    this.uploadFile(item);
  });
}

onPfeSelect(pfeId: number): void {
  this.selectedPfeId = pfeId;
  this.pfeId = pfeId; // Update the pfeId used for uploads
  this.selectedPfe = this.pfes.find(pfe => pfe.id === pfeId) || null;
  this.initializeUploader(); // Reinitialize uploader with new pfeId
  this.loadDocuments(); // Load documents for the selected PFE
}
}