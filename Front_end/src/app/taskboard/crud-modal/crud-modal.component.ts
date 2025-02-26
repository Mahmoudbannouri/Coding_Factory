import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crud-modal',
  templateUrl: './crud-modal.component.html',
  styleUrls: ['./crud-modal.component.scss']
})
export class CrudModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }

  private buildItemForm(item) {
    this.myForm = this.formBuilder.group({
      title: [item.title || '', Validators.required],
      message: [item.message || '', Validators.required],
      type: [item.type || '', Validators.required],
    });
  }
  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

}
