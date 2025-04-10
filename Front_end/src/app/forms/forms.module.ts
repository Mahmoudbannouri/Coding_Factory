import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FormsRoutingModule } from "./forms-routing.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ngx-custom-validators';
import { ArchwizardModule } from 'angular-archwizard';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill'
import { MatchHeightModule } from "../shared/directives/match-height.directive";


import { ValidationFormsComponent } from "./validation/validation-forms.component";
import { InputsComponent } from './elements/inputs/inputs.component';
import { InputGroupsComponent } from './elements/input-groups/input-groups.component';
import { ArchwizardComponent } from './archwizard/archwizard.component';
import { RadioComponent } from './elements/radio/radio.component';
import { CheckboxComponent } from './elements/checkbox/checkbox.component';
import { SwitchComponent } from './elements/switch/switch.component';
import { LayoutComponent } from './layout/layout.component';
import { DatepickerComponent } from './elements/datepicker/datepicker.component';
import { TimepickerComponent } from './elements/timepicker/timepicker.component';
import { TagsInputComponent } from './elements/tags-input/tags-input.component';
import { EditorComponent } from './elements/editor/editor.component';
import { SelectComponent } from './elements/select/select.component';
@NgModule({
    imports: [
        CommonModule,
        FormsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        ArchwizardModule,
        CustomFormsModule,
        MatchHeightModule,
        NgbModule,
        UiSwitchModule,
        QuillModule.forRoot(),
        NgSelectModule,
        TagInputModule
    ],
    declarations: [
        ValidationFormsComponent,
        InputsComponent,
        InputGroupsComponent,
        ArchwizardComponent,
        RadioComponent,
        CheckboxComponent,
        SwitchComponent,
        LayoutComponent,
        DatepickerComponent,
        TimepickerComponent,
        TagsInputComponent,
        EditorComponent,
        SelectComponent,
    ]

})
export class FormModule { }
