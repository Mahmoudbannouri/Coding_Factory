import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'juryNames',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Add Jury Member</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="juryName">Jury Member Name</label>
        <input type="text" class="form-control" id="juryName" [(ngModel)]="juryName" placeholder="Enter jury member name">
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="save()">Save</button>
    </div>
  `
})
export class Jury{
  @Input() pfeId: number;
  juryName: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  save() {
    if (this.juryName) {
      this.activeModal.close(this.juryName);
    }
  }
}