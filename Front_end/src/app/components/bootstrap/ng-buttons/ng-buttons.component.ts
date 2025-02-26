import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-ng-buttons',
  templateUrl: './ng-buttons.component.html',
  styleUrls: ['./ng-buttons.component.scss']
})
export class NgButtonsComponent implements OnInit {

  // Checkbox Buttons
    model = {
        left: true,
        middle: false,
        right: false
    };

    // Radio Buttons
    modelRadio = 1;

    // Checkbox and Radio Buttons (Reactive Forms)
    public checkboxGroupForm: UntypedFormGroup;
    public radioGroupForm: UntypedFormGroup;

    constructor(private formBuilder: UntypedFormBuilder) { }

    ngOnInit() {
        this.checkboxGroupForm = this.formBuilder.group({
            left: true,
            middle: false,
            right: false
        });
        this.radioGroupForm = this.formBuilder.group({
             'modelRadioForm': 'Left'
        });
    }
}
