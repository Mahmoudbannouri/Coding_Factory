import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'meetingDattes',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Schedule Meeting</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="meetingDate">Meeting Date</label>
        <input type="datetime-local" class="form-control" id="meetingDate" [(ngModel)]="meetingDate">
      </div>
      <div class="form-group">
        <label for="meetingLink">Meeting Link</label>
        <input type="text" class="form-control" id="meetingLink" [(ngModel)]="meetingLink" placeholder="Enter meeting link">
      </div>
      <div class="form-group">
        <label for="meetingNotes">Notes</label>
        <textarea class="form-control" id="meetingNotes" [(ngModel)]="meetingNotes" placeholder="Enter meeting notes"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="save()">Save</button>
    </div>
  `
})
export class Meeting {
  
  @Input() pfeId: number;
  meetingDate: string;
  meetingLink: string = '';
  meetingNotes: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  save() {
    if (this.meetingDate) {
      const meetingData = {
        date: new Date(this.meetingDate),
        link: this.meetingLink,
        notes: this.meetingNotes
      };
      this.activeModal.close(meetingData);
    }
  }
  
}