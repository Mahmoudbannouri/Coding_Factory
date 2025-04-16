import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'document',
  template: `
   <div class="modal-header bg-primary">
  <h4 class="modal-title text-white">Ajouter un document</h4>
  <button type="button" class="close text-white" aria-label="Close" (click)="activeModal.dismiss()">
    <span aria-hidden="true">&times;</span>
  </button>
</div>

<div class="modal-body">
  <div class="form-group">
    <label for="fileInput" class="font-weight-bold">Sélectionner un fichier</label>
    <div class="custom-file">
      <input type="file" class="custom-file-input" id="fileInput" 
             (change)="onFileSelected($event)" accept=".pdf,.doc,.docx,.xls,.xlsx">
      <label class="custom-file-label" for="fileInput">
        {{ fileName || 'Choisir un fichier...' }}
      </label>
    </div>
    <small class="form-text text-muted">Formats acceptés : PDF, Word, Excel</small>
  </div>

  <div class="preview-section mt-4" *ngIf="fileUrl">
    <h5 class="text-bold-500">Aperçu</h5>
    <div class="card">
      <div class="card-body text-center">
        <i class="ft-file-text font-large-2 mb-1"></i>
        <p class="card-text text-truncate">{{ fileName }}</p>
        <a [href]="fileUrl" target="_blank" class="btn btn-sm btn-outline-primary">
          <i class="ft-eye"></i> Voir le document
        </a>
      </div>
    </div>
  </div>
</div>

<div class="modal-footer">
  <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss()">
    <i class="ft-x"></i> Annuler
  </button>
  <button type="button" class="btn btn-primary" (click)="save()" [disabled]="!selectedFile">
    <i class="ft-save"></i> Enregistrer
  </button>
</div>
  `,
 styles:[` 

.modal-content {
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #eee;
}

.custom-file-label::after {
  content: "Parcourir";
}

.preview-section {
  border-top: 1px dashed #eee;
  padding-top: 15px;
  
  .card {
    border: 1px dashed #ccc;
    background-color: #f9f9f9;
    
    &:hover {
      background-color: #f0f0f0;
    }
  }
}

.btn-outline-primary {
  &:hover {
    color: white;
  }
} `]

})
export class Document {
  @Input() pfeId: number;
  selectedFile: File | null = null;
  fileName: string = '';
  fileUrl: SafeUrl | null = null;

  constructor(public activeModal: NgbActiveModal
              , private sanitizer: DomSanitizer) {}
  

              onFileSelected(event: any) {
                this.selectedFile = event.target.files[0];
                this.fileName = this.selectedFile?.name || '';
                
                if (this.selectedFile) {
                  const fileURL = URL.createObjectURL(this.selectedFile);
                  this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileURL);
                }
              }
            
              save() {
                if (this.selectedFile) {
                  const documentData = {
                    file: this.selectedFile,
                    name: this.fileName
                  };
                  this.activeModal.close(documentData);
                }
              }
            }