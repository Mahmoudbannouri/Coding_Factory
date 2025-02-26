import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/User';

@Component({
  selector: 'app-show-students-modal',
  templateUrl: './show-students-modal.component.html',
  styleUrls: ['./show-students-modal.component.scss']
})
export class ShowStudentsModalComponent {
  @Input() showModal: boolean = false;
  @Input() students: User[] = [];
  @Output() showModalChange = new EventEmitter<boolean>();

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }
}
